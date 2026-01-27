using FluentValidation;
using MediatR;
using MessagingPlatform.Application.Common.Interfaces;
using MessagingPlatform.Application.Common.Models;
using MessagingPlatform.Application.Features.Wildberries.DTOs;
using MessagingPlatform.Domain.Entities;
using MessagingPlatform.Domain.Repositories;
using MessagingPlatform.Domain.ValueObjects;

namespace MessagingPlatform.Application.Features.Wildberries.Commands;

public sealed record AddWbAccountCommand(
    Guid UserId,
    string ApiToken,
    string ShopName) : IRequest<Result<WbAccountDto>>;

public sealed class AddWbAccountCommandValidator : AbstractValidator<AddWbAccountCommand>
{
    public AddWbAccountCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("Идентификатор пользователя обязателен");

        RuleFor(x => x.ApiToken)
            .NotEmpty().WithMessage("API токен обязателен")
            .MinimumLength(32).WithMessage("API токен должен содержать минимум 32 символа")
            .MaximumLength(512).WithMessage("API токен не может превышать 512 символов");

        RuleFor(x => x.ShopName)
            .NotEmpty().WithMessage("Название магазина обязательно")
            .MaximumLength(200).WithMessage("Название магазина не может превышать 200 символов");
    }
}

internal sealed class AddWbAccountCommandHandler : IRequestHandler<AddWbAccountCommand, Result<WbAccountDto>>
{
    private readonly IWbAccountRepository _accountRepository;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWildberriesApiClient _wbApiClient;

    public AddWbAccountCommandHandler(
        IWbAccountRepository accountRepository,
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IWildberriesApiClient wbApiClient)
    {
        _accountRepository = accountRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _wbApiClient = wbApiClient;
    }

    public async Task<Result<WbAccountDto>> Handle(AddWbAccountCommand request, CancellationToken ct)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, ct);
        if (user is null)
            return Result.Failure<WbAccountDto>("Пользователь не найден");

        var shopExists = await _accountRepository.ExistsForUserAsync(request.UserId, request.ShopName, ct);
        if (shopExists)
            return Result.Failure<WbAccountDto>("Магазин с таким названием уже добавлен");

        var isValidToken = await _wbApiClient.ValidateTokenAsync(request.ApiToken, ct);
        if (!isValidToken)
            return Result.Failure<WbAccountDto>("Недействительный API токен Wildberries");

        var apiToken = WbApiToken.Create(request.ApiToken);
        var account = WbAccount.Create(request.UserId, apiToken, request.ShopName);

        await _accountRepository.AddAsync(account, ct);
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
