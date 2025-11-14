import React from 'react';
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>MsgGenie Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your MsgGenie verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Welcome to MsgGenie, {username}!</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for signing up with <strong>MsgGenie</strong>.
            <br />
            Please use the verification code below to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>
            <strong style={{ fontSize: '20px', letterSpacing: '2px' }}>{otp}</strong>
          </Text>
        </Row>
        <Row>
          <Text>
            <strong>Note:</strong> This code is valid for <strong>1 hour</strong> only.
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, you can safely ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            href={`${process.env.NEXTAUTH_URL}/verify/${encodeURIComponent(
              username,
            )}?c=${encodeURIComponent(otp)}`}
            style={{
              backgroundColor: '#2196f3',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: 'bold',
              textDecoration: 'none',
              marginTop: '10px',
              display: 'inline-block',
            }}
          >
            Verify your MsgGenie account
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
