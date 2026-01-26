using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Auth.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;

namespace MessagingPlatform.Application.Features.Auth.Commands;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<Result<AuthResponse>>;

public sealed class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}

internal sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<AuthResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtProvider _jwtProvider;

    public RefreshTokenCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken ct)
    {
        var existingToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, ct);

        if (existingToken is null || !existingToken.IsActive)
            return Result.Failure<AuthResponse>("Invalid or expired refresh token");

        var user = await _userRepository.GetByIdAsync(existingToken.UserId, ct);

        if (user is null || !user.IsActive)
            return Result.Failure<AuthResponse>("User not found or deactivated");

        var newRefreshTokenValue = _jwtProvider.GenerateRefreshToken();
        existingToken.Revoke(replacedByToken: newRefreshTokenValue);

        var newRefreshToken = RefreshToken.Create(user.Id, newRefreshTokenValue, 7);
        var accessToken = _jwtProvider.GenerateAccessToken(user);

        await _refreshTokenRepository.AddAsync(newRefreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponse(
            user.Id,
            user.Email.Value,
            accessToken,
            newRefreshTokenValue,
            newRefreshToken.ExpiresAt);
    }
}
