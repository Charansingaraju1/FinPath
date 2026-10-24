package com.finpath.service;

import com.finpath.dto.FinancialProfileDto;
import com.finpath.entity.FinancialProfile;
import com.finpath.entity.User;
import com.finpath.repository.FinancialProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class FinancialProfileService {

    private final FinancialProfileRepository financialProfileRepository;

    public FinancialProfileService(FinancialProfileRepository financialProfileRepository) {
        this.financialProfileRepository = financialProfileRepository;
    }

    public FinancialProfile getOrCreateProfile(User user) {
        return financialProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> financialProfileRepository.save(new FinancialProfile(user)));
    }

    public FinancialProfileDto getProfileDto(Long userId) {
        FinancialProfile profile = financialProfileRepository.findByUserId(userId).orElse(null);
        return profile != null ? mapToDto(profile) : new FinancialProfileDto();
    }

    @Transactional
    public FinancialProfileDto updateProfile(User user, FinancialProfileDto dto) {
        FinancialProfile profile = getOrCreateProfile(user);

        if (dto.getMonthlyTakeHomeIncome() != null) profile.setMonthlyTakeHomeIncome(dto.getMonthlyTakeHomeIncome());
        if (dto.getMonthlyEssentialExpenses() != null) profile.setMonthlyEssentialExpenses(dto.getMonthlyEssentialExpenses());
        if (dto.getMonthlyDiscretionaryExpenses() != null) profile.setMonthlyDiscretionaryExpenses(dto.getMonthlyDiscretionaryExpenses());
        if (dto.getMonthlyDebtRepayments() != null) profile.setMonthlyDebtRepayments(dto.getMonthlyDebtRepayments());
        if (dto.getCurrentSavings() != null) profile.setCurrentSavings(dto.getCurrentSavings());
        if (dto.getOtherRecurringIncome() != null) profile.setOtherRecurringIncome(dto.getOtherRecurringIncome());
        if (dto.getAvailableStartupBudget() != null) profile.setAvailableStartupBudget(dto.getAvailableStartupBudget());
        if (dto.getDebtIncludedInExpenses() != null) profile.setDebtIncludedInExpenses(dto.getDebtIncludedInExpenses());

        profile = financialProfileRepository.save(profile);
        return mapToDto(profile);
    }

    public FinancialProfileDto mapToDto(FinancialProfile profile) {
        FinancialProfileDto dto = new FinancialProfileDto();
        dto.setMonthlyTakeHomeIncome(profile.getMonthlyTakeHomeIncome());
        dto.setMonthlyEssentialExpenses(profile.getMonthlyEssentialExpenses());
        dto.setMonthlyDiscretionaryExpenses(profile.getMonthlyDiscretionaryExpenses());
        dto.setMonthlyDebtRepayments(profile.getMonthlyDebtRepayments());
        dto.setCurrentSavings(profile.getCurrentSavings());
        dto.setOtherRecurringIncome(profile.getOtherRecurringIncome());
        dto.setAvailableStartupBudget(profile.getAvailableStartupBudget());
        dto.setDebtIncludedInExpenses(profile.getDebtIncludedInExpenses());
        return dto;
    }
}
