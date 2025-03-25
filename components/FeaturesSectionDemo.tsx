import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Desenvolvimento Personalizado",
      description:
        "Ofereço soluções sob medida para as necessidades do seu negócio, utilizando as melhores práticas de desenvolvimento para entregar resultados de alta qualidade.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Consultoria Técnica Especializada",
      description:
        "Ajudamos sua empresa a escolher as melhores tecnologias e estratégias para alcançar seus objetivos, com foco em eficiência e inovação.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Sites e Aplicações Responsivos",
      description:
        "Criação de sites e aplicações totalmente responsivos, garantindo uma excelente experiência em dispositivos móveis, tablets e desktops.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Integração e APIs",
      description: "Integro sistemas de maneira eficaz e crio APIs robustas para facilitar a comunicação entre plataformas, melhorando a performance e a escalabilidade dos seus produtos.",
      icon: <IconCloud />,
    },
    {
      title: "Desenvolvimento Ágil",
      description: "Utilizo metodologias ágeis para garantir entregas rápidas, com total transparência e flexibilidade durante todo o processo de desenvolvimento.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Otimização de Desempenho",
      description:
        "Especializado em melhorar o desempenho de sites e aplicativos, reduzindo o tempo de carregamento e proporcionando uma experiência mais fluida para os usuários.",
      icon: <IconHelp />,
    },
    {
      title: "SEO e Marketing Digital",
      description:
        "Além do desenvolvimento, também ofereço estratégias de SEO e marketing digital para aumentar a visibilidade do seu site nos motores de busca e atrair mais visitantes.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Suporte Contínuo",
      description: "Forneço suporte técnico contínuo, garantindo que suas aplicações e sistemas estejam sempre atualizados e funcionando sem problemas.",
      icon: <IconHeart />,
    },
    

  ];
  return (
    <div className="relative z-10 mx-auto max-w-7xl py-10">
      <div className="">
        <h1 className="heading mt-16 mb-10 text-purple">Soluções</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col py-10 lg:border-r",
        (index === 0 || index === 4) && "dark:border-neutral-800 lg:border-l",
        index < 4 && "dark:border-neutral-800 lg:border-b",
      )}
    >
      {index < 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full rounded-lg bg-gradient-to-t from-black-200 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 4 && (
        <div className="pointer-events-none absolute inset-0 h-full w-full rounded-lg bg-gradient-to-b from-black-200 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="relative z-10 mb-4 px-10 text-purple">{icon}</div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-violet-500 dark:bg-neutral-700" />
        <span className="inline-block text-white transition duration-200 group-hover/feature:translate-x-2">
          {title}
        </span>
      </div>
      <p className="relative z-10 px-10 text-sm text-neutral-600">
        {description}
      </p>
    </div>
  );
};
