import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Section,
  Button,
  Link,
  Hr,
  Img,
} from "@react-email/components";

interface CreateOrganizationEmailProps {
  adminName: string;
  organizationName: string;
  signUpLink: string;
}

export function CreateOrganizationEmail({
  adminName,
  organizationName,
  signUpLink,
}: CreateOrganizationEmailProps) {
  const previewText = `Complete o cadastro da ${organizationName} no Risko`;

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
                Bem-vindo ao <strong>Risko</strong>!
              </Heading>

              <Text className="text-black text-[14px] leading-[24px]">
                Olá <strong>{adminName}</strong>,
              </Text>

              <Text className="text-black text-[14px] leading-[24px]">
                Parabéns! Sua organização <strong>{organizationName}</strong>{" "}
                foi registrada no Risko. Para começar a usar a plataforma, você
                precisa completar seu cadastro criando uma senha.
              </Text>

              <Text className="text-black text-[14px] leading-[24px]">
                Como administrador da organização, você terá acesso completo a
                todos os recursos da plataforma, incluindo:
              </Text>

              <ul className="text-black text-[14px] leading-[24px]">
                <li>Dashboard de analytics em tempo real</li>
                <li>Configuração do chatbot</li>
                <li>Gerenciamento de membros da equipe</li>
                <li>Relatórios e insights de bem-estar</li>
              </ul>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={signUpLink}
                >
                  Completar cadastro
                </Button>
              </Section>

              <Text className="text-black text-[14px] leading-[24px]">
                ou copie e cole este link no seu navegador:{" "}
                <Link href={signUpLink} className="text-blue-600 no-underline">
                  {signUpLink}
                </Link>
              </Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px]">
                <strong>Importante:</strong> Este link é válido por 24 horas por
                questões de segurança. Se o link expirar, entre em contato com
                nossa equipe.{" "}
                <strong>Não compartilhe este link com outras pessoas.</strong>
              </Text>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px]">
                Se você não estava esperando este email ou não assinou contrato
                com o Risko, por favor ignore esta mensagem ou entre em contato
                conosco respondendo este email.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

CreateOrganizationEmail.PreviewProps = {
  adminName: "John Doe",
  organizationName: "Acme Corp",
  signUpLink: `http://localhost:3000/sign-up?token=abc123def456`,
} as CreateOrganizationEmailProps;

export default CreateOrganizationEmail;
