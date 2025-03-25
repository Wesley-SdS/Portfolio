import React from "react";

const AboutMe: React.FC = () => {
  return (
    <section className="py-16 px-6 lg:px-20  text-violet-250">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-violet-500 mb-8">
          Sobre <span className="text-violet-300">Mim</span>
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Imagem de perfil */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
            <img
              src="/your-profile-picture.jpg"
              alt="Minha foto"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Texto sobre mim */}
          <div className="flex-1">
            <p className="text-lg leading-relaxed mb-4">
              Olá! Meu nome é <span className="font-semibold text-violet-300">Wesley Santos</span>, 
              sou um desenvolvedor apaixonado por criar soluções inovadoras. Tenho experiência em desenvolvimento 
              <strong> frontend, backend e fullstack</strong>, com foco na entrega de resultados excepcionais.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Ao longo da minha carreira, trabalhei em projetos desafiadores como e-commerces, dashboards e plataformas 
              personalizadas. Tenho expertise em tecnologias como <strong>React.js, Next.js, Angular, Node.js, TypeScript, Tailwind CSS</strong>, 
              e estou sempre me atualizando para oferecer o melhor desempenho nas soluções.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Fora do ambiente de trabalho, sou muito ligado à minha família. Sou casado e, nos momentos de lazer, gosto muito de 
              assistir filmes e séries com minha esposa, comendo uma pipoca. Além disso, Sou pai da Madalena. Minha família é a minha maior fonte de inspiração e felicidade que me motiva a buscar sempre mais e a ser melhor em tudo o que faço por ela..
            </p>
            <p className="text-lg leading-relaxed mb-4">
            Nos meus hobbies, gosto de estudar e ampliar meus conhecimentos. Também aprecio praticar esportes, como correr e pedalar. No meu tempo livre, dedico-me a explorar novas tecnologias, experimentar receitas criativas na cozinha e aproveitar momentos tranquilos com minha família.
            </p>
            <p className="text-lg leading-relaxed">
              Se você precisa de alguém dedicado, criativo e apaixonado pelo que faz, estou aqui para transformar sua ideia em realidade. 
              Vamos trabalhar juntos!
            </p>

            {/* Botões de contato */}
            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="bg-violet-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-violet-700 transition"
              >
                Entre em Contato
              </a>
              <a
                href="/curriculo.pdf"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition"
                download
              >
                Baixar Currículo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
