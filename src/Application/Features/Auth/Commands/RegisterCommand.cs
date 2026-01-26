using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Auth.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Auth.Commands;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string? FirstName,
    string? LastName) : IRequest<Result<AuthResponse>>;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(128)
            .Matches(@"[A-Z]").WithMessage("Password must contain uppercase letter")
            .Matches(@"[a-z]").WithMessage("Password must contain lowercase letter")
            .Matches(@"[0-9]").WithMessage("Password must contain digit")
            .Matches(@"[^a-zA-Z0-9]").WithMessage("Password must contain special character");

        RuleFor(x => x.FirstName)
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .MaximumLength(100);
    }
}

internal sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<AuthResponse>>
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public RegisterCommandHandler(
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

    public async Task<Result<AuthResponse>> Handle(RegisterCommand request, CancellationToken ct)
    {
        var email = Email.Create(request.Email);

        if (await _userRepository.ExistsAsync(email, ct))
            return Result.Failure<AuthResponse>("User with this email already exists");

        var passwordHash = PasswordHash.Create(_passwordHasher.Hash(request.Password));
        var user = User.Create(email, passwordHash);

        if (!string.IsNullOrWhiteSpace(request.FirstName) || !string.IsNullOrWhiteSpace(request.LastName))
            user.UpdateProfile(request.FirstName, request.LastName);

        await _userRepository.AddAsync(user, ct);

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
