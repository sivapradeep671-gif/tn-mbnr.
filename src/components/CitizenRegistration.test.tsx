import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CitizenRegistration } from './CitizenRegistration';
import { LanguageProvider } from '../context/LanguageContext';
import { translations } from '../utils/translations';
import React from 'react';

const cReg = translations.en.citizen_reg;

// Wrap component with necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <LanguageProvider>
            {ui}
        </LanguageProvider>
    );
};

describe('Layer 2: Component Tests - CitizenRegistration', () => {
    it('renders the initial step correctly', () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        // Verify Title and Subtitle are present (using translated values)
        expect(screen.getByText(cReg.title)).toBeDefined();
        expect(screen.getByText(cReg.subtitle)).toBeDefined();
        
        // Verify the initiate button is visible
        const initiateBtn = screen.getByRole('button');
        expect(initiateBtn).toBeDefined();
        expect(initiateBtn.textContent).toContain(cReg.initiate);
    });

    it('progresses to step 2 when initiate button is clicked', async () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        const initiateBtn = screen.getByRole('button');
        fireEvent.click(initiateBtn);
        
        // Wait for the form to appear
        await waitFor(() => {
            expect(screen.getByRole('textbox', { name: cReg.labels.aadhaar })).toBeDefined();
            expect(screen.getByRole('textbox', { name: cReg.labels.mobile })).toBeDefined();
        });
    });

    it('handles form submission and shows loading state', async () => {
        renderWithProviders(<CitizenRegistration onComplete={vi.fn()} />);
        
        // Go to step 2
        fireEvent.click(screen.getByRole('button'));
        
        // Fill form
        const aadhaarInput = screen.getByRole('textbox', { name: cReg.labels.aadhaar });
        const mobileInput = screen.getByRole('textbox', { name: cReg.labels.mobile });
        
        fireEvent.change(aadhaarInput, { target: { value: '1234-5678-9012' } });
        fireEvent.change(mobileInput, { target: { value: '9876543210' } });
        
        // Consent checkbox must be checked
        const consentCheckbox = screen.getByRole('checkbox');
        fireEvent.click(consentCheckbox);
        
        // Submit
        const submitBtn = screen.getByRole('button', { name: cReg.submit });
        fireEvent.click(submitBtn);
        
        // Button should show verifying state
        expect(screen.getByText(cReg.verifying)).toBeDefined();
        expect(submitBtn.hasAttribute('disabled')).toBe(true);
    });

    it('calls onComplete when the final step button is clicked', async () => {
        const mockOnComplete = vi.fn();
        renderWithProviders(<CitizenRegistration onComplete={mockOnComplete} />);
        
        // Go to step 2
        fireEvent.click(screen.getByRole('button'));
        
        // Fill form
        const aadhaarInput = screen.getByRole('textbox', { name: cReg.labels.aadhaar });
        const mobileInput = screen.getByRole('textbox', { name: cReg.labels.mobile });
        
        fireEvent.change(aadhaarInput, { target: { value: '1234-5678-9012' } });
        fireEvent.change(mobileInput, { target: { value: '9876543210' } });
        
        // Consent checkbox must be checked
        const consentCheckbox = screen.getByRole('checkbox');
        fireEvent.click(consentCheckbox);
        
        // Submit step 2
        fireEvent.click(screen.getByRole('button', { name: cReg.submit }));
        
        // Wait for step 3 (simulating the 1500ms timeout)
        await waitFor(() => {
            expect(screen.getByText(cReg.success_title)).toBeDefined();
        }, { timeout: 2000 });
        
        // Click enter portal button
        const enterBtn = screen.getByRole('button', { name: cReg.enter });
        fireEvent.click(enterBtn);
        
        // Assert callback was fired
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
});


