Plano

- Remover da Home (`src/pages/Index.tsx`) a seção “Focused work / Selected projects”, incluindo os cards de preview e o botão “All work”.
- Limpar imports e variáveis que ficarem sem uso, como `WorkProjectCard`, `featuredProjects` e ícones relacionados apenas a essa seção, se aplicável.
- Manter a página `/work` como o local principal para listar os projetos.
- Validar com type-check/build para garantir que não restaram imports não utilizados ou erros de renderização.