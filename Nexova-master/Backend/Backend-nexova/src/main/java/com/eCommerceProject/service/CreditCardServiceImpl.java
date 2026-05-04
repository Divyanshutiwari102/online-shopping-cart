package com.eCommerceProject.service;

import com.eCommerceProject.model.CreditCard;
import com.eCommerceProject.model.User;
import com.eCommerceProject.repository.CreditCardRepository;
import com.eCommerceProject.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreditCardServiceImpl implements CreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final UserService userService;

    @Override
    public List<CreditCard> getAll() {
        return creditCardRepository.findAll();
    }

    @Override
    public CreditCard add(CreditCard creditCard) {
        return creditCardRepository.save(creditCard);
    }

    @Override
    public List<CreditCard> getCreditCardByUserId(int id) {
        // FIX: null check karo pehle
        User user = userService.getById(id);
        if (user != null && user.getCreditCard() != null) {
            return Collections.singletonList(user.getCreditCard());
        }
        return Collections.emptyList();
    }

    @Override
    public CreditCard getBydId(int id) {
        Optional<CreditCard> creditCard = creditCardRepository.findById(id);
        return creditCard.orElse(null);
    }
}
