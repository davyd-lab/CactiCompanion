import { ChatContainer, MainContainer, Message, MessageInput, MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import styles from '@/styles/Chat.module.css';
import { useEffect, useRef, useState } from "react";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";


type Message = {
    content: string;
    sentTime: number;
    sender: string;
    direction: 'incoming' | 'outgoing';
}

const CHATGPT_USER = "ChatGPT";
//const DEAFULT_BEHAVIOR = "Plant Conversation";
const CONFIGURATION = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const OPENAI_CLIENT = new OpenAIApi(CONFIGURATION);

export default function Chat() {
    const messageInput = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    //const [behavior, setBehavior] = useState(DEAFULT_BEHAVIOR);


    const [waitingForResponse, setWaitingForResponse] = useState(false);

    useEffect(() => {
        if (!waitingForResponse) {
            messageInput.current?.focus();
        }
    }, [waitingForResponse]);

    const sendMessage = async (innerHtml: string, textContent: string, innerText: string, nodes: NodeList) => {
      const newMessage: Message = {
          content: textContent,
          sentTime: Math.floor(Date.now() / 1000),
          sender: 'You',
          direction: 'outgoing',
      }
      setMessages([newMessage]);
  
      setWaitingForResponse(true);
      const response = await getResponse([newMessage]);
  
      const newMessageResponse: Message = {
        content: response.content || 'No content',
        sentTime: Math.floor(Date.now() / 1000),
        sender: CHATGPT_USER,
        direction: 'incoming',
    }
  
      setMessages([newMessage, newMessageResponse]);
      setWaitingForResponse(false);
  }

  const getResponse = async (newMessageList: Message[]) => {
    const systemMessage = {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: 'You are an expert on plant care, specifically cacti'
    }

    const input = newMessageList.map((message) => {
        return {
            role: message.sender === CHATGPT_USER ? ChatCompletionRequestMessageRoleEnum.Assistant : ChatCompletionRequestMessageRoleEnum.User,
            content: message.content,
        }
    });

    const response = await OPENAI_CLIENT.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...input],
    });
    console.log(response);

    return {
        content: response.data.choices[0].message?.content || 'No content',
    }
}


    return (
        <div className={`${styles.container} font-sans`}>
                <h1 className="pb-8 text-2xl pb-8 px-8">CactiCompanion</h1>
                <p className="pb-8 px-8">The CactiCompanion tool is perfect for both experienced gardeners and beginners. Simply enter the name of a cactus, using either its common or scientific name, and receive tailored care instructions specific to your plant. No more guessing or generic advice, but straightforward, easy-to-follow guidelines for your cactus. Whether you're caring for a hearty saguaro or a delicate fairy castle cactus, CactiCompanion is here to help ensure your plants thrive.</p>
            <div className={styles.chatWrapper}>

                <div className={`${styles.chatContainer}`}>
                    <MainContainer style={{flexDirection: 'column'}}>
                    <MessageInput
                        style={{minWidth: '55%'}}  
                        className="text-center mx-auto"
                        placeholder={waitingForResponse ? "CactiCompanion is thinking..." : "Enter Cactus Name Here"}
                        onSend={sendMessage}
                        autoFocus={true}
                        attachButton={false}
                        disabled={waitingForResponse}
                        ref={messageInput}
                    />
                        <ChatContainer>

                            <MessageList className={styles.chatMessageList}
                                typingIndicator={waitingForResponse && <TypingIndicator content="CactiCompanion is thinking" />}>
                                {
                                    messages.map((message, index) => {
                                        return (
                                            <Message
                                                model={{
                                                    message: message.content,
                                                    sentTime: `${message.sentTime}`,
                                                    sender: message.sender,
                                                    direction: message.direction,
                                                    position: 'normal',
                                                    type: 'text',
                                                }}
                                                key={index}
                                            />
                                        )
                                    })
                                }
                            </MessageList>

                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        </div>
    )
}