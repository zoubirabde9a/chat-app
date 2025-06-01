export function createChatBoxStyles() {
    return `
        .chat-panel {
            position: relative;
            z-index: 1;
            width: min(500px, 90vw);
            height: min(800px, 90vh);
            background: rgba(255, 255, 255, 0.95);
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0, 150, 255, 0.2);
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 0;
            border: 1px solid rgba(0, 150, 255, 0.3);
            overflow: hidden;
            min-width: 320px;
            min-height: 500px;
            animation: slideIn 0.6s ease-out forwards;
            transition: all 0.3s ease;
            resize: none;
        }

        .chat-panel::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00ff88, #00b8ff, #0066ff);
            z-index: -1;
            border-radius: 6px;
            opacity: 0.3;
            transition: opacity 0.3s ease;
        }

        .chat-panel:hover::before {
            opacity: 0.5;
        }

        .chat-panel:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
        }

        #chat-container {
            flex-grow: 1;
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
            height: calc(100% - 80px);
            scroll-behavior: smooth;
            background: linear-gradient(180deg, 
                rgba(255, 255, 255, 0.95) 0%,
                rgba(255, 255, 255, 0.85) 100%);
        }

        .input-container {
            padding: 15px;
            border-top: 1px solid rgba(0, 150, 255, 0.2);
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: rgba(255, 255, 255, 0.95);
            box-sizing: border-box;
            height: 120px;
            flex-shrink: 0;
            position: relative;
            align-items: center;
        }

        .input-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, 
                transparent 0%,
                rgba(0, 150, 255, 0.5) 50%,
                transparent 100%);
        }

        #message-input {
            flex-grow: 0;
            padding: 10px 12px;
            border: 1px solid rgba(0, 150, 255, 0.3);
            border-radius: 4px;
            font-size: 15px;
            background: rgba(0, 150, 255, 0.05);
            color: #333;
            transition: all 0.3s ease;
            width: 90%;
            height: 40px;
            resize: none;
            overflow-y: auto;
            max-height: 40px;
        }

        #message-input:focus {
            outline: none;
            border-color: rgba(0, 150, 255, 0.5);
            background: rgba(0, 150, 255, 0.1);
            box-shadow: 0 0 15px rgba(0, 150, 255, 0.2);
        }

        #message-input::placeholder {
            color: rgba(0, 150, 255, 0.5);
        }

        #message-input:disabled {
            cursor: not-allowed;
            background: rgba(0, 150, 255, 0.02);
            border-color: rgba(0, 150, 255, 0.1);
        }

        .button-container {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            height: 40px;
        }

        button {
            padding: 8px 20px;
            border: 2px solid rgba(0, 150, 255, 0.3);
            border-radius: 6px;
            background: rgba(0, 150, 255, 0.15);
            color: #333;
            cursor: pointer;
            font-size: 15px;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            position: relative;
            overflow: hidden;
            min-width: 120px;
            box-shadow: 0 4px 15px rgba(0, 150, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            height: 100%;
        }

        button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(0, 150, 255, 0.3),
                transparent
            );
            transition: 0.5s;
        }

        button:hover::before {
            left: 100%;
        }

        button:hover {
            background: rgba(0, 150, 255, 0.25);
            border-color: rgba(0, 150, 255, 0.6);
            box-shadow: 0 6px 20px rgba(0, 150, 255, 0.4);
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 10px rgba(0, 150, 255, 0.3);
        }

        button:disabled {
            cursor: not-allowed;
            background: rgba(0, 150, 255, 0.05);
            border-color: rgba(0, 150, 255, 0.1);
            box-shadow: none;
        }

        button:disabled::before {
            display: none;
        }

        .message {
            margin-bottom: 15px;
            max-width: 70%;
            opacity: 0;
            transform: translateY(20px);
            animation: messageAppear 0.3s ease-out forwards;
            display: flex;
        }

        @keyframes messageAppear {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .user-message {
            margin-left: auto;
            justify-content: flex-end;
        }

        .assistant-message {
            margin-right: auto;
            justify-content: flex-start;
        }

        .message-content {
            padding: 12px 18px;
            border-radius: 4px;
            display: inline-block;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            max-width: 100%;
        }

        .message-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 150, 255, 0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .message-content:hover::before {
            opacity: 1;
        }

        .user-message .message-content {
            background: rgba(0, 150, 255, 0.15);
            color: #333;
            border: 1px solid rgba(0, 150, 255, 0.3);
            box-shadow: 0 0 15px rgba(0, 150, 255, 0.2);
        }

        .assistant-message .message-content {
            background: rgba(0, 150, 255, 0.05);
            color: #333;
            border: 1px solid rgba(0, 150, 255, 0.1);
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }

        .typing-indicator {
            background: transparent !important;
            color: rgba(0, 150, 255, 0.7) !important;
            border: none !important;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .typing-indicator .message-content {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
            align-items: center;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background: rgba(0, 150, 255, 0.7);
            border-radius: 50%;
            animation: typingDot 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingDot {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-6px);
            }
        }

        @keyframes slideIn {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* Custom scrollbar */
        #chat-container::-webkit-scrollbar {
            width: 8px;
        }

        #chat-container::-webkit-scrollbar-track {
            background: rgba(0, 150, 255, 0.1);
        }

        #chat-container::-webkit-scrollbar-thumb {
            background: rgba(0, 150, 255, 0.3);
            border-radius: 4px;
        }

        #chat-container::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 150, 255, 0.5);
        }
    `;
} 