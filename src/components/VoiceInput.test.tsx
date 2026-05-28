import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { VoiceInput } from './VoiceInput';
import { showToast } from '../hooks/useToast';

// Mock the toast hook
vi.mock('../hooks/useToast', () => ({
    showToast: vi.fn(),
}));

// Mock Language Context
vi.mock('../context/LanguageContext', () => ({
    useLanguage: () => ({
        t: {
            voice: {
                placeholder: 'placeholder',
                listening: 'listening',
                captured: 'Speech captured',
                error: 'Speech error'
            }
        }
    })
}));

interface MockRecognition {
    start: ReturnType<typeof vi.fn>;
    onstart: (() => void) | null;
    onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
}

// Mock SpeechRecognition API
const createMockRecognition = (): MockRecognition => ({
    start: vi.fn(),
    onstart: null,
    onresult: null,
    onerror: null,
    onend: null,
    lang: '',
    interimResults: false,
    maxAlternatives: 1,
});

describe('VoiceInput Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset global recognition mocks
        const win = window as unknown as Record<string, unknown>;
        win.webkitSpeechRecognition = vi.fn().mockImplementation(createMockRecognition);
        win.SpeechRecognition = undefined;
    });

    it('should NOT render if SpeechRecognition is not supported', () => {
        // Use delete to properly remove properties from window
        const win = window as unknown as Record<string, unknown>;
        delete win.webkitSpeechRecognition;
        delete win.SpeechRecognition;

        const { container } = render(<VoiceInput onResult={() => {}} />);
        expect(container.firstChild).toBeNull();
    });

    it('should render the Mic icon initially', () => {
        render(<VoiceInput onResult={() => {}} />);
        const button = screen.getByRole('button');
        expect(button).toBeDefined();
    });

    it('should start listening when clicked', async () => {
        const onResult = vi.fn();
        let instance: MockRecognition | undefined;
        const win = window as unknown as Record<string, unknown>;

        win.webkitSpeechRecognition = vi.fn().mockImplementation(() => {
            instance = createMockRecognition();
            return instance;
        });

        render(<VoiceInput onResult={onResult} />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(instance).toBeDefined();
        if (instance) {
            expect(instance.start).toHaveBeenCalled();

            // Simulate onstart
            await act(async () => {
                if (instance?.onstart) instance.onstart();
            });
        }

        expect(button.className).toContain('animate-pulse');
    });

    it('should call onResult and show success toast when speech is received', async () => {
        const onResult = vi.fn();
        let instance: MockRecognition | undefined;
        const win = window as unknown as Record<string, unknown>;

        win.webkitSpeechRecognition = vi.fn().mockImplementation(() => {
            instance = createMockRecognition();
            return instance;
        });

        render(<VoiceInput onResult={onResult} />);
        fireEvent.click(screen.getByRole('button'));

        // Simulate onresult
        const mockResultEvent = {
            results: [[{ transcript: 'Hello Gemini' }]]
        };

        expect(instance).toBeDefined();
        if (instance) {
            await act(async () => {
                if (instance?.onresult) instance.onresult(mockResultEvent);
            });
        }

        expect(onResult).toHaveBeenCalledWith('Hello Gemini');
        expect(showToast).toHaveBeenCalledWith('Speech captured', 'success');
    });

    it('should handle errors gracefully', async () => {
        const onResult = vi.fn();
        let instance: MockRecognition | undefined;
        const win = window as unknown as Record<string, unknown>;

        win.webkitSpeechRecognition = vi.fn().mockImplementation(() => {
            instance = createMockRecognition();
            return instance;
        });

        render(<VoiceInput onResult={onResult} />);
        fireEvent.click(screen.getByRole('button'));

        // Simulate onerror
        expect(instance).toBeDefined();
        if (instance) {
            await act(async () => {
                if (instance?.onerror) instance.onerror({ error: 'not-allowed' });
            });
        }

        expect(showToast).toHaveBeenCalledWith('Speech error: not-allowed', 'error');
    });
});

