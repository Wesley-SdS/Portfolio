"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "../components/ui/layout-grid";

export function LayoutGridDemo() {
  return (
    <section id="gallery" className="h-screen w-full py-20">
      <div className="">
        <h1 className="heading">
          <span className="text-purple">Galeria</span>
        </h1>
      </div>
      <LayoutGrid cards={cards} />
    </section>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="text-xl font-bold text-white md:text-4xl">
        House in the woods
      </p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
      Plataforma personalizada para venda de produtos naturais e orgânicos, com design intuitivo e integração de pagamentos. Desenvolvida para oferecer uma experiência de compra rápida, segura e envolvente.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="text-xl font-bold text-white md:text-4xl">
       Dashboard
      </p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
      Dashboard interativo para monitoramento de métricas empresariais, com gráficos dinâmicos e dados em tempo real. Focado em usabilidade e visualização clara de KPIs estratégicos.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="text-xl font-bold text-white md:text-4xl">
      FInance IA
      </p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
      Plataforma inteligente que utiliza IA para análise financeira, previsão de tendências e gerenciamento de despesas. Ideal para tomada de decisões estratégicas e controle financeiro eficiente.
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="text-xl font-bold text-white md:text-4xl">
      word hierarchy builder
      </p>
      <p className="text-base font-normal text-white"></p>
      <p className="my-4 max-w-lg text-base font-normal text-neutral-200">
      Ferramenta versátil para construir e organizar hierarquias de palavras, taxonomias e árvores genealógicas. Ideal para SEO, categorização de conteúdo e visualização clara de relações estruturais
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: "/ecommerce.png",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "/Dashboard.png",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "/finance-dashboard.png",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: "/Word.png",
  },

  
];
