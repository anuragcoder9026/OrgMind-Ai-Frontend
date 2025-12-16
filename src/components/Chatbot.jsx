import { ChatBotWidget } from 'orgmindai-chatbot-widget';
import 'orgmindai-chatbot-widget/style.css';
export default function Chatbot() {
    return (
        <ChatBotWidget
            apiKey="sk_org_7b4ff4cf6236f6bd5e534fa1286ff1f778b72b5c79385459"
            apiBaseUrl="http://localhost:5000" // Point to your backend
        />
    );
}