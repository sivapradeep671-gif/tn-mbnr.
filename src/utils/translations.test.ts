import { describe, it, expect } from 'vitest';
import { translations } from './translations';

describe('Translations', () => {
    it('should have both English and Tamil translations', () => {
        expect(translations.en).toBeDefined();
        expect(translations.ta).toBeDefined();
    });

    it('should have matching keys in English and Tamil', () => {
        const enKeys = Object.keys(translations.en);
        const taKeys = Object.keys(translations.ta);
        
        expect(enKeys.sort()).toEqual(taKeys.sort());
    });

    it('should have matching nested keys for nav', () => {
        const enNavKeys = Object.keys(translations.en.nav);
        const taNavKeys = Object.keys(translations.ta.nav);
        
        expect(enNavKeys.sort()).toEqual(taNavKeys.sort());
    });

    it('should have matching nested keys for scanner status', () => {
        const enStatusKeys = Object.keys(translations.en.scanner.status);
        const taStatusKeys = Object.keys(translations.ta.scanner.status);
        
        expect(enStatusKeys.sort()).toEqual(taStatusKeys.sort());
    });

    it('should have matching nested keys for scanner messages', () => {
        const enMsgKeys = Object.keys(translations.en.scanner.messages);
        const taMsgKeys = Object.keys(translations.ta.scanner.messages);
        
        expect(enMsgKeys.sort()).toEqual(taMsgKeys.sort());
    });
});
