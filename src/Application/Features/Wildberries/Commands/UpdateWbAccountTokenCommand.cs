using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Wildberries.Commands;

public sealed record UpdateWbAccountTokenCommand(
    Guid UserId,
    Guid AccountId,
    string NewToken) : IRequest<Result<WbAccountDto>>;

public sealed class UpdateWbAccountTokenCommandValidator : AbstractValidator<UpdateWbAccountTokenCommand>
{
    public UpdateWbAccountTokenCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя обязателен");

        RuleFor(x => x.AccountId)
            .NotEmpty().WithMessage("Идентификатор аккаунта обязателен");

        RuleFor(x => x.NewToken)
            .NotEmpty().WithMessage("API токен обязателен")
            .MinimumLength(32).WithMessage("API токен должен содержать минимум 32 символа")
            .MaximumLength(512).WithMessage("API токен не может превышать 512 символов");
    }
}

internal sealed class UpdateWbAccountTokenCommandHandler : IRequestHandler<UpdateWbAccountTokenCommand, Result<WbAccountDto>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;

    public UpdateWbAccountTokenCommandHandler(
        IWbAccountRepository accountRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient)
    {
        _accountRepository = accountRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
    }

    public async Task<Result<WbAccountDto>> Handle(UpdateWbAccountTokenCommand request, CancellationToken ct)
    {
        var account = await _accountRepository.GetByIdWithUserAsync(request.AccountId, request.UserId, ct);
        if (account is null)
            return Result.Failure<WbAccountDto>("Аккаунт не найден или у вас нет прав на его изменение");

        var isValidToken = await _wbApiClient.ValidateTokenAsync(request.NewToken, ct);
        if (!isValidToken)
            return Result.Failure<WbAccountDto>("Недействительный API токен Wildberries");

        var newApiToken = WbApiToken.Create(request.NewToken);
        account.UpdateToken(newApiToken);

        _accountRepository.Update(account);
        await _unitOfWork.SaveChangesAsync(ct);

        return new WbAccountDto(
            account.Id,
            account.ShopName,
            account.Status,
            account.LastSyncAt,
            account.CreatedAt,
            account.ErrorMessage);
    }
}
