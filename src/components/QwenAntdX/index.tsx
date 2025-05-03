import { useXAgent, useXChat, Sender, Bubble } from '@ant-design/x';
import { UserOutlined, CopyOutlined, AlibabaOutlined } from '@ant-design/icons';
import OpenAI from 'openai';
import React, { useEffect, useState } from 'react';
import type { GetProp } from 'antd';
import { Button, Flex, Space, Spin, message as antdMessage } from 'antd';
import MarkdownRender from './MarkdownRender';
import dayjs from 'dayjs';
const client = new OpenAI({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: import.meta.env.DASHSCOPE_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Independent: React.FC = () => {
  // 静态时间状态
  const [staticTime, setStaticTime] = useState('');

  // 组件挂载时初始化时间
  useEffect(() => {
    setStaticTime(dayjs().format('HH:mm:ss'));
  }, []); // 空依赖数组确保只执行一次
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      const { messages, message } = info;

      const { onSuccess, onUpdate } = callbacks;

      // current message
      console.log('message', message);

      // history messages
      console.log('messages', messages);

      let content: any = '';

      try {
        const stream = await client.chat.completions.create({
          model: 'qwen-plus',
          // if chat context is needed, modify the array
          messages: [
            { role: 'system', content: 'hello' },
            { role: 'user', content: message! }
          ],
          // stream mode
          stream: true,
        });
        for await (const chunk of stream) {
          content += chunk.choices[0]?.delta?.content || '';
          onUpdate(content);
        }
        onSuccess(content);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const {
    // use to send message
    onRequest,
    // use to render messages
    messages,
  } = useXChat({ agent });

  const items = messages.map(({ message, id }, index) => ({
    key: id,
    content: message,
    role: index % 2 === 0 ? 'user' : 'assistant',
    footer: (
      <Flex>
        <Button
          size="small"
          type="text"
          onClick={() => {
            navigator.clipboard.writeText(message);
            antdMessage.success('复制成功！', 0.5);
          }}
          title="复制"
          icon={<CopyOutlined />}
          style={{ marginInlineEnd: 'auto' }}
        />
      </Flex>
    ),
  }));
  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    user: {
      placement: 'end',
      avatar: { icon: <UserOutlined />, style: { background: '#87d068' } },
      header: `${staticTime} 我`,
      messageRender: (content) => <MarkdownRender content={content} />,
    },
    assistant: {
      placement: 'start',
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 600,
        marginInlineEnd: 44,
      },
      styles: {
        footer: {
          width: '100%',
        },
      },
      avatar: { icon: <AlibabaOutlined />, style: { background: '#5c6ac4' } },
      header: `${staticTime} Assistant`,
      messageRender: (content) => <MarkdownRender content={content} />,
      loadingRender: () => (
        <Space>
          <Spin size="small" />
          loading...
        </Space>
      ),
    },
  };
  return (
    <div>
      <Bubble.List
        items={items}
        roles={roles}
        autoScroll
      />
      <Sender style={{ marginTop: '16px' }} onSubmit={onRequest} />
    </div>
  );
};

export default Independent;
