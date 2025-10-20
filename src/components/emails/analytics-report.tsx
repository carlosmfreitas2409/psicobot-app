import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Img,
  Text,
  Tailwind,
  Section,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface AnalyticsReportEmailProps {
  organizationName: string;
  periodStart: string;
  periodEnd: string;
  metrics: {
    totalChats: number;
    totalChatsChange: string;
    healthyPercentage: number;
    healthyChange: string;
    averageDuration: number;
    durationChange: string;
    wellbeingScore: number;
    wellbeingScoreChange: string;
  };
  riskLevels: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  topTopics: Array<{
    name: string;
    amount: number;
    type: "positive" | "negative" | "warning";
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
  wellbeingDistribution: {
    wellbeing: number;
    neutral: number;
    concern: number;
    suffering: number;
  };
}

export function AnalyticsReportEmail({
  organizationName,
  periodStart,
  periodEnd,
  metrics,
  riskLevels,
  topTopics,
  recommendations,
  wellbeingDistribution,
}: AnalyticsReportEmailProps) {
  const previewText = `Relatório de Bem-Estar - ${periodStart} a ${periodEnd}`;

  const hasAlert = riskLevels.critical > 0;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto px-[40px] py-[40px] max-w-[650px]">
            <div className="max-w-[600px] mx-auto">
              <div className="text-center">
                <Img
                  src="https://cdn.dev.inzone.com/risko.png"
                  alt="Risko"
                  width={52}
                  className="inline-block"
                />
              </div>

              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[20px] mx-0">
                Relatório de <strong>Bem-Estar</strong>
              </Heading>

              <Text className="text-black text-[14px] leading-[24px]">
                Olá,
              </Text>

              <Text className="text-black text-[14px] leading-[24px]">
                Aqui está o relatório de bem-estar da{" "}
                <strong>{organizationName}</strong> referente ao período de{" "}
                <strong>{periodStart}</strong> a <strong>{periodEnd}</strong>.
              </Text>

              {hasAlert && (
                <Section className="bg-[#fef2f2] border border-solid border-[#fecaca] rounded p-4 my-[24px]">
                  <Text className="text-[#991b1b] text-[14px] font-semibold leading-[24px] m-0">
                    ⚠️ Atenção Requerida
                  </Text>
                  <Text className="text-[#7f1d1d] text-[13px] leading-[20px] mt-[8px] mb-0">
                    {riskLevels.critical}{" "}
                    {riskLevels.critical === 1
                      ? "caso crítico foi identificado"
                      : "casos críticos foram identificados"}{" "}
                    e requerem atenção imediata da equipe de RH.
                  </Text>
                </Section>
              )}

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Heading className="text-black text-[18px] font-semibold mt-[32px] mb-[16px]">
                📊 Visão Geral
              </Heading>

              <Section className="mb-[24px]">
                <Row>
                  <Column className="w-1/2 pr-2">
                    <div className="border border-solid border-[#eaeaea] rounded p-4 h-full">
                      <Text className="text-[#666666] text-[12px] leading-[16px] m-0 mb-[4px]">
                        Total de Conversas
                      </Text>
                      <Text className="text-black text-[24px] font-bold leading-[32px] m-0">
                        {metrics.totalChats}
                      </Text>
                      <Text
                        className={`text-[13px] leading-[20px] m-0 mt-[4px] ${metrics.totalChatsChange.startsWith("+") || !metrics.totalChatsChange.startsWith("-") ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                      >
                        {metrics.totalChatsChange} vs. período anterior
                      </Text>
                    </div>
                  </Column>
                  <Column className="w-1/2 pl-2">
                    <div className="border border-solid border-[#eaeaea] rounded p-4 h-full">
                      <Text className="text-[#666666] text-[12px] leading-[16px] m-0 mb-[4px]">
                        Bem-Estar Saudável
                      </Text>
                      <Text className="text-black text-[24px] font-bold leading-[32px] m-0">
                        {metrics.healthyPercentage}%
                      </Text>
                      <Text
                        className={`text-[13px] leading-[20px] m-0 mt-[4px] ${metrics.healthyChange.startsWith("+") || parseFloat(metrics.healthyChange) >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                      >
                        {metrics.healthyChange}% vs. período anterior
                      </Text>
                    </div>
                  </Column>
                </Row>
              </Section>

              <Section className="mb-[24px]">
                <Row>
                  <Column className="w-1/2 pr-2">
                    <div className="border border-solid border-[#eaeaea] rounded p-4 h-full">
                      <Text className="text-[#666666] text-[12px] leading-[16px] m-0 mb-[4px]">
                        Duração Média
                      </Text>
                      <Text className="text-black text-[24px] font-bold leading-[32px] m-0">
                        {metrics.averageDuration} min
                      </Text>
                      <Text
                        className={`text-[13px] leading-[20px] m-0 mt-[4px] ${metrics.durationChange.startsWith("+") || parseFloat(metrics.durationChange) >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                      >
                        {metrics.durationChange} min vs. período anterior
                      </Text>
                    </div>
                  </Column>
                  <Column className="w-1/2 pl-2">
                    <div className="border border-solid border-[#eaeaea] rounded p-4 h-full">
                      <Text className="text-[#666666] text-[12px] leading-[16px] m-0 mb-[4px]">
                        Score de Bem-Estar
                      </Text>
                      <Text className="text-black text-[24px] font-bold leading-[32px] m-0">
                        {metrics.wellbeingScore}/10
                      </Text>
                      <Text
                        className={`text-[13px] leading-[20px] m-0 mt-[4px] ${metrics.wellbeingScoreChange.startsWith("+") || parseFloat(metrics.wellbeingScoreChange) >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                      >
                        {metrics.wellbeingScoreChange} vs. período anterior
                      </Text>
                    </div>
                  </Column>
                </Row>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Heading className="text-black text-[18px] font-semibold mt-[32px] mb-[16px]">
                🚨 Níveis de Risco
              </Heading>

              <Section className="bg-[#fafafa] rounded p-4 mb-[24px]">
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ marginBottom: "12px" }}
                >
                  <tr>
                    <td width="50%" style={{ verticalAlign: "middle" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              paddingRight: "8px",
                            }}
                          >
                            <div
                              className="w-[12px] h-[12px] rounded-full bg-[#dc2626]"
                              style={{ display: "inline-block" }}
                            />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <Text className="text-[14px] leading-[20px] m-0">
                              Crítico
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      align="right"
                      style={{ verticalAlign: "middle" }}
                    >
                      <Text className="text-[#dc2626] text-[20px] font-bold leading-[20px] m-0">
                        {riskLevels.critical}
                      </Text>
                    </td>
                  </tr>
                </table>
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ marginBottom: "12px" }}
                >
                  <tr>
                    <td width="50%" style={{ verticalAlign: "middle" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              paddingRight: "8px",
                            }}
                          >
                            <div
                              className="w-[12px] h-[12px] rounded-full bg-[#f97316]"
                              style={{ display: "inline-block" }}
                            />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <Text className="text-[14px] leading-[20px] m-0">
                              Alto
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      align="right"
                      style={{ verticalAlign: "middle" }}
                    >
                      <Text className="text-[#f97316] text-[20px] font-bold leading-[20px] m-0">
                        {riskLevels.high}
                      </Text>
                    </td>
                  </tr>
                </table>
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ marginBottom: "12px" }}
                >
                  <tr>
                    <td width="50%" style={{ verticalAlign: "middle" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              paddingRight: "8px",
                            }}
                          >
                            <div
                              className="w-[12px] h-[12px] rounded-full bg-[#eab308]"
                              style={{ display: "inline-block" }}
                            />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <Text className="text-[14px] leading-[20px] m-0">
                              Médio
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      align="right"
                      style={{ verticalAlign: "middle" }}
                    >
                      <Text className="text-[#eab308] text-[20px] font-bold leading-[20px] m-0">
                        {riskLevels.medium}
                      </Text>
                    </td>
                  </tr>
                </table>
                <table width="100%" cellPadding="0" cellSpacing="0">
                  <tr>
                    <td width="50%" style={{ verticalAlign: "middle" }}>
                      <table cellPadding="0" cellSpacing="0">
                        <tr>
                          <td
                            style={{
                              verticalAlign: "middle",
                              paddingRight: "8px",
                            }}
                          >
                            <div
                              className="w-[12px] h-[12px] rounded-full bg-[#16a34a]"
                              style={{ display: "inline-block" }}
                            />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            <Text className="text-[14px] leading-[20px] m-0">
                              Baixo
                            </Text>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      width="50%"
                      align="right"
                      style={{ verticalAlign: "middle" }}
                    >
                      <Text className="text-[#16a34a] text-[20px] font-bold leading-[20px] m-0">
                        {riskLevels.low}
                      </Text>
                    </td>
                  </tr>
                </table>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Heading className="text-black text-[18px] font-semibold mt-[32px] mb-[16px]">
                😊 Distribuição Emocional
              </Heading>

              <Section className="bg-[#fafafa] rounded p-4 mb-[24px]">
                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-[14px] leading-[20px] m-0">
                      Bem-Estar
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-[14px] font-semibold leading-[20px] m-0">
                      {wellbeingDistribution.wellbeing}%
                    </Text>
                  </Column>
                </Row>
                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-[14px] leading-[20px] m-0">
                      Neutro
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-[14px] font-semibold leading-[20px] m-0">
                      {wellbeingDistribution.neutral}%
                    </Text>
                  </Column>
                </Row>
                <Row className="mb-[8px]">
                  <Column className="w-2/3">
                    <Text className="text-[14px] leading-[20px] m-0">
                      Preocupação
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-[14px] font-semibold leading-[20px] m-0">
                      {wellbeingDistribution.concern}%
                    </Text>
                  </Column>
                </Row>
                <Row>
                  <Column className="w-2/3">
                    <Text className="text-[14px] leading-[20px] m-0">
                      Sofrimento
                    </Text>
                  </Column>
                  <Column className="w-1/3 text-right">
                    <Text className="text-[14px] font-semibold leading-[20px] m-0">
                      {wellbeingDistribution.suffering}%
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              {topTopics.length > 0 && (
                <>
                  <Heading className="text-black text-[18px] font-semibold mt-[32px] mb-[16px]">
                    💬 Principais Temas
                  </Heading>

                  <Section className="mb-[24px]">
                    {topTopics.slice(0, 5).map((topic, index) => (
                      <table
                        key={`${topic.name}-${topic.amount}`}
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        style={{
                          marginBottom: "8px",
                          paddingBottom:
                            index < topTopics.slice(0, 5).length - 1
                              ? "8px"
                              : "0",
                          borderBottom:
                            index < topTopics.slice(0, 5).length - 1
                              ? "1px solid #eaeaea"
                              : "none",
                        }}
                      >
                        <tr>
                          <td width="70%" style={{ verticalAlign: "middle" }}>
                            <table cellPadding="0" cellSpacing="0">
                              <tr>
                                <td
                                  style={{
                                    verticalAlign: "middle",
                                    paddingRight: "8px",
                                  }}
                                >
                                  <div
                                    className={`w-[8px] h-[8px] rounded-full ${
                                      topic.type === "positive"
                                        ? "bg-[#16a34a]"
                                        : topic.type === "negative"
                                          ? "bg-[#dc2626]"
                                          : "bg-[#eab308]"
                                    }`}
                                    style={{ display: "inline-block" }}
                                  />
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <Text className="text-[14px] leading-[20px] m-0">
                                    {topic.name}
                                  </Text>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            width="30%"
                            align="right"
                            style={{ verticalAlign: "middle" }}
                          >
                            <Text className="text-[#666666] text-[13px] leading-[20px] m-0">
                              {topic.amount} menções
                            </Text>
                          </td>
                        </tr>
                      </table>
                    ))}
                  </Section>

                  <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                </>
              )}

              {recommendations.length > 0 && (
                <>
                  <Heading className="text-black text-[18px] font-semibold mt-[32px] mb-[16px]">
                    💡 Recomendações
                  </Heading>

                  <Section className="mb-[24px]">
                    {recommendations.map((rec, index) => (
                      <div
                        key={rec.title}
                        className={`border border-solid rounded p-4 ${index < recommendations.length - 1 ? "mb-[12px]" : ""} ${
                          rec.priority === "high"
                            ? "border-[#fecaca] bg-[#fef2f2]"
                            : rec.priority === "medium"
                              ? "border-[#fde68a] bg-[#fefce8]"
                              : "border-[#bbf7d0] bg-[#f0fdf4]"
                        }`}
                      >
                        <Text
                          className={`text-[14px] font-semibold leading-[20px] m-0 mb-[4px] ${
                            rec.priority === "high"
                              ? "text-[#991b1b]"
                              : rec.priority === "medium"
                                ? "text-[#854d0e]"
                                : "text-[#166534]"
                          }`}
                        >
                          {rec.title}
                        </Text>
                        <Text
                          className={`text-[13px] leading-[20px] m-0 ${
                            rec.priority === "high"
                              ? "text-[#7f1d1d]"
                              : rec.priority === "medium"
                                ? "text-[#713f12]"
                                : "text-[#14532d]"
                          }`}
                        >
                          {rec.description}
                        </Text>
                      </div>
                    ))}
                  </Section>

                  <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                </>
              )}

              <Text className="text-black text-[14px] leading-[24px]">
                Para visualizar o relatório completo e interativo, acesse o
                dashboard da plataforma.
              </Text>

              <Text className="text-[#666666] text-[12px] leading-[24px] mt-[24px]">
                Este é um relatório automático gerado pelo Risko. Os dados
                apresentados são baseados nas interações registradas no período
                especificado.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

AnalyticsReportEmail.PreviewProps = {
  organizationName: "Acme Corp",
  periodStart: "01/10/2024",
  periodEnd: "31/10/2024",
  metrics: {
    totalChats: 1234,
    totalChatsChange: "+15%",
    healthyPercentage: 73,
    healthyChange: "+5.2",
    averageDuration: 8,
    durationChange: "+2",
    wellbeingScore: 7.8,
    wellbeingScoreChange: "+0.4",
  },
  riskLevels: {
    critical: 2,
    high: 8,
    medium: 15,
    low: 42,
  },
  topTopics: [
    { name: "Equilíbrio trabalho-vida", amount: 156, type: "warning" },
    { name: "Reconhecimento", amount: 142, type: "positive" },
    { name: "Sobrecarga de trabalho", amount: 128, type: "negative" },
    { name: "Desenvolvimento de carreira", amount: 98, type: "positive" },
    { name: "Estresse", amount: 87, type: "negative" },
  ],
  recommendations: [
    {
      title: "Atenção a casos críticos",
      description:
        "2 casos críticos identificados requerem ação imediata da equipe de RH para suporte individualizado.",
      priority: "high",
    },
    {
      title: "Programa de equilíbrio trabalho-vida",
      description:
        "O tema 'Equilíbrio trabalho-vida' aparece com frequência. Considere implementar políticas de flexibilidade.",
      priority: "medium",
    },
    {
      title: "Fortalecer cultura de reconhecimento",
      description:
        "Feedback positivo sobre reconhecimento. Continue investindo em programas de valorização.",
      priority: "low",
    },
  ],
  wellbeingDistribution: {
    wellbeing: 33,
    neutral: 24,
    concern: 22,
    suffering: 21,
  },
} as AnalyticsReportEmailProps;

export default AnalyticsReportEmail;
