import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Tailwind,
  Section,
  Row,
  Column,
  Button,
  Link,
  Hr,
} from "@react-email/components";

interface InviteUserEmailProps {
  invitationUrl: string;
  organizationName: string;
  userEmail: string;
  authorName: string;
}

const DICEBEAR_URL =
  "https://api.dicebear.com/7.x/initials/png?backgroundType=gradientLinear&fontFamily=Helvetica&fontSize=40&seed=";

export function InviteUserEmail({
  invitationUrl,
  organizationName,
  userEmail,
  authorName,
}: InviteUserEmailProps) {
  const previewText = `Join the ${organizationName} organization on Risko`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto px-[40px] py-[40px] max-w-[600px]">
            <div className="max-w-[465px] mx-auto">
              <div className="text-center">
                <Img
                  src="https://cdn.dev.inzone.com/risko.png"
                  alt="Risko"
                  width={52}
                  className="inline-block"
                />
              </div>

              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[28px] mx-0">
                Entrar em <strong>{organizationName}</strong> no{" "}
                <strong>Risko</strong>
              </Heading>

              <Text className="text-black text-[14px] leading-[24px]">
                Olá,
              </Text>
              <Text className="text-black text-[14px] leading-[24px]">
                <strong>{authorName}</strong> te convidou para entrar em{" "}
                <strong>{organizationName}</strong> no <strong>Risko</strong>.
              </Text>

              <Section>
                <Row>
                  <Column align="right">
                    <Img
                      src={`${DICEBEAR_URL}${userEmail}`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </Column>
                  <Column align="center">
                    <Img
                      src="https://d3qihw9kewwkyn.cloudfront.net/static/emails/arrow.png"
                      width="12"
                      height="9"
                      alt="te convidou para entrar em"
                    />
                  </Column>
                  <Column align="left">
                    <Img
                      src={`${DICEBEAR_URL}${organizationName}`}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </Column>
                </Row>
              </Section>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={invitationUrl}
                >
                  Entrar na organização
                </Button>
              </Section>

              <Text className="text-black text-[14px] leading-[24px]">
                ou copie e cole este link no seu navegador:{" "}
                <Link
                  href={invitationUrl}
                  className="text-blue-600 no-underline"
                >
                  {invitationUrl}
                </Link>
              </Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Se você não estava esperando este convite, você pode ignorar
                esta mensagem. Se você está preocupado com a segurança de sua
                conta, por favor, responda a esta mensagem para entrar em
                contato conosco.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

InviteUserEmail.PreviewProps = {
  invitationUrl: "http://localhost:3000/accept-invite?token=abc123def456",
  organizationName: "Acme, Inc",
  userEmail: "john.doe@example.com",
  authorName: "Jane Doe",
} as InviteUserEmailProps;

export default InviteUserEmail;
