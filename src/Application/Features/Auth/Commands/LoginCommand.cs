using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Auth.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Auth.Commands;

public sealed record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponse>>;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}

internal sealed class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public LoginCommandHandler(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task<Result<AuthResponse>> Handle(LoginCommand request, CancellationToken ct)
    {
        var email = Email.Create(request.Email);
        var user = await _userRepository.GetByEmailAsync(email, ct);

        if (user is null)
            return Result.Failure<AuthResponse>("Invalid credentials");

        if (!user.IsActive)
            return Result.Failure<AuthResponse>("Account is deactivated");

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash.Value))
            return Result.Failure<AuthResponse>("Invalid credentials");

        user.RecordLogin();
        _userRepository.Update(user);

        var accessToken = _jwtProvider.GenerateAccessToken(user);
        var refreshTokenValue = _jwtProvider.GenerateRefreshToken();
        var refreshToken = RefreshToken.Create(user.Id, refreshTokenValue, 7);

        await _refreshTokenRepository.AddAsync(refreshToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new AuthResponse(
            user.Id,
            user.Email.Value,
            accessToken,
            refreshTokenValue,
            refreshToken.ExpiresAt);
    }
}
