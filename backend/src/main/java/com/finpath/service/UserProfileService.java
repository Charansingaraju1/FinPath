package com.finpath.service;

import com.finpath.dto.UserProfileDto;
import com.finpath.entity.User;
import com.finpath.entity.UserProfile;
import com.finpath.exception.ResourceNotFoundException;
import com.finpath.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository profileRepository;

    public UserProfileService(UserProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public UserProfileDto getProfile(Long userId) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return mapToDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(User user, UserProfileDto dto) {
        UserProfile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> new UserProfile(user));

        if (dto.getDisplayName() != null) profile.setDisplayName(dto.getDisplayName());
        if (dto.getAgeRange() != null) profile.setAgeRange(dto.getAgeRange());
        if (dto.getCountry() != null) profile.setCountry(dto.getCountry());
        if (dto.getStateRegion() != null) profile.setStateRegion(dto.getStateRegion());
        if (dto.getEducationEmploymentStatus() != null) profile.setEducationEmploymentStatus(dto.getEducationEmploymentStatus());
        if (dto.getOccupation() != null) profile.setOccupation(dto.getOccupation());
        if (dto.getSkills() != null) profile.setSkills(dto.getSkills());
        if (dto.getExperienceLevel() != null) profile.setExperienceLevel(dto.getExperienceLevel());
        if (dto.getInterests() != null) profile.setInterests(dto.getInterests());
        if (dto.getAvailableHoursPerWeek() != null) profile.setAvailableHoursPerWeek(dto.getAvailableHoursPerWeek());
        if (dto.getEquipmentResources() != null) profile.setEquipmentResources(dto.getEquipmentResources());
        if (dto.getWillingnessToLearn() != null) profile.setWillingnessToLearn(dto.getWillingnessToLearn());
        if (dto.getPreferredIncomeModel() != null) profile.setPreferredIncomeModel(dto.getPreferredIncomeModel());
        if (dto.getOnboardingCompleted() != null) profile.setOnboardingCompleted(dto.getOnboardingCompleted());

        profile = profileRepository.save(profile);
        return mapToDto(profile);
    }

    private UserProfileDto mapToDto(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setDisplayName(profile.getDisplayName());
        dto.setAgeRange(profile.getAgeRange());
        dto.setCountry(profile.getCountry());
        dto.setStateRegion(profile.getStateRegion());
        dto.setEducationEmploymentStatus(profile.getEducationEmploymentStatus());
        dto.setOccupation(profile.getOccupation());
        dto.setSkills(profile.getSkills());
        dto.setExperienceLevel(profile.getExperienceLevel());
        dto.setInterests(profile.getInterests());
        dto.setAvailableHoursPerWeek(profile.getAvailableHoursPerWeek());
        dto.setEquipmentResources(profile.getEquipmentResources());
        dto.setWillingnessToLearn(profile.getWillingnessToLearn());
        dto.setPreferredIncomeModel(profile.getPreferredIncomeModel());
        dto.setOnboardingCompleted(profile.getOnboardingCompleted());
        return dto;
    }
}
