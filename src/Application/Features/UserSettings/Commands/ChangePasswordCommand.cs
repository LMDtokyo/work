using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.UserSettings.Commands;

public sealed record ChangePasswordCommand(
    Guid UserId,
    string OldPassword,
    string NewPassword) : IRequest<Result<bool>>;

public sealed class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.OldPassword)
            .NotEmpty().WithMessage("Текущий пароль обязателен");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("Новый пароль обязателен")
            .MinimumLength(8).WithMessage("Пароль должен содержать минимум 8 символов")
            .Matches(@"[A-Z]").WithMessage("Пароль должен содержать хотя бы одну заглавную букву")
            .Matches(@"[a-z]").WithMessage("Пароль должен содержать хотя бы одну строчную букву")
            .Matches(@"[0-9]").WithMessage("Пароль должен содержать хотя бы одну цифру");

        RuleFor(x => x)
            .Must(x => x.NewPassword != x.OldPassword)
            .WithMessage("Новый пароль должен отличаться от текущего")
            .WithName("NewPassword");
    }
}

internal sealed class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result<bool>>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;

    public ChangePasswordCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user is null)
            return Result.Failure<bool>("Пользователь не найден");

        if (!user.IsActive)
            return Result.Failure<bool>("Аккаунт деактивирован");

        // Verify current password
        if (!_passwordHasher.Verify(request.OldPassword, user.PasswordHash.Value))
            return Result.Failure<bool>("Неверный текущий пароль");

        // Hash and update new password
        var newPasswordHash = PasswordHash.Create(_passwordHasher.Hash(request.NewPassword));
        user.UpdatePassword(newPasswordHash);

        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync(ct);

        return true;
    }
}
