# You Build It 🛠️

![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0081C9?style=flat-square&logo=framer&logoColor=white)
![MDX](https://img.shields.io/badge/-MDX-0081C9?style=flat-square&logo=mdx&logoColor=white)

![preview](/preview.png)

**Helping you become a better software engineer through coding challenges that build real applications.**

## 🎯 About

You Build It is an interactive coding challenges platform designed to help developers improve their programming skills through hands-on, practical projects. Unlike traditional algorithmic challenges, our platform focuses on building real-world applications and tools that you'll actually use.

### Key Features

- 🔍 **Interactive Challenge Browser** - Browse challenges by difficulty, category, and required skills
- 📚 **Rich Content Experience** - Challenges written in MDX with syntax highlighting and interactive elements
- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- 🔧 **Real-World Projects** - Build actual tools like Docker, grep, JSON parsers, web servers, and more
- 📊 **Skill Tracking** - Track the technologies and concepts you learn
- 🚀 **Progressive Difficulty** - From beginner-friendly to advanced challenges

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **pnpm** 9.0 or higher (package manager)
- **Git** for version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/youbuildit/youbuildit.dev.git
   cd youbuildit.dev
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

   Edit the `.env` file and add your environment variables (see [Environment Variables](#-environment-variables) section below).

4. **Run the development server:**

   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── challenges/    # Challenges API endpoint
│   │   └── commit/        # Commit tracking API
│   ├── challenge/         # Individual challenge pages
│   ├── challenges/        # Challenge browser page
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable React components
│   ├── mdx/              # MDX-specific components
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   └── ui/               # Base UI components
├── content/              # Challenge content (MDX files)
│   └── challenges/       # Individual challenge files
├── lib/                  # Utility functions and configuration
├── public/               # Static assets
├── styles/               # Global styles and CSS
└── types/                # TypeScript type definitions
```

## 🔧 Technology Stack

### Core Technologies

- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 19.1.1](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Key Libraries

- **[Framer Motion](https://www.framer.com/motion/)** - Animations and transitions
- **[shadcn/ui](https://ui.shadcn.com/)** - Copy-paste React components built on Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI primitives
- **[MDX](https://mdxjs.com/)** - Markdown with React components
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** - Code syntax highlighting
- **[Gray Matter](https://github.com/jonschlinkert/gray-matter)** - Front matter parsing
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Heroicons](https://heroicons.com/)** - Additional icon set
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[clsx](https://github.com/lukeed/clsx)** - Utility for constructing className strings
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind CSS classes without conflicts

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting with Next.js and Prettier integration
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for pre-commit validation
- **[lint-staged](https://github.com/okonet/lint-staged)** - Run linters on staged files
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

## 🔐 Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to `.env` and configure the following variables:

### Required Variables

| Variable       | Description                                          | Required   | Default |
| -------------- | ---------------------------------------------------- | ---------- | ------- |
| `GITHUB_TOKEN` | GitHub personal access token for commit tracking API | Optional\* | -       |

### Optional Variables

| Variable               | Description                  | Required | Default       |
| ---------------------- | ---------------------------- | -------- | ------------- |
| `NODE_ENV`             | Node environment             | No       | `development` |
| `NEXT_PUBLIC_BASE_URL` | Base URL for the application | No       | Auto-detected |

### Setting up GitHub Token

1. **Create a GitHub Personal Access Token:**
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `public_repo` (for public repositories)
   - Copy the generated token

2. **Add to your `.env` file:**
   ```bash
   GITHUB_TOKEN=ghp_your_token_here
   ```

**Note:** The GitHub token is optional for local development but required for the commit tracking feature to work properly.

### Environment File Structure

```bash
# .env
GITHUB_TOKEN=your_github_personal_access_token_here
NODE_ENV=development
```

## ⚡ Features & Architecture

### Challenge System

- **Dynamic Challenge Loading**: Challenges are dynamically loaded from MDX files in the `content/challenges/` directory
- **Rich Metadata**: Each challenge includes difficulty, category, skills, estimated time, and more
- **Interactive Content**: MDX allows for interactive code examples and embedded components
- **Search & Filtering**: Advanced filtering by difficulty, category, and skills

### API Endpoints

- `GET /api/challenges` - Fetch all available challenges with metadata
- `POST /api/commit` - Track challenge completion and progress

### UI Components

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animation System**: Smooth page transitions and micro-interactions with Framer Motion
- **Accessibility**: Built with semantic HTML and ARIA attributes
- **Dark Mode Ready**: Component architecture supports theme switching

### Content Management

- **MDX Integration**: Challenges written in MDX for rich, interactive content
- **Syntax Highlighting**: Automatic syntax highlighting for code blocks
- **Table of Contents**: Auto-generated TOC for long-form content
- **Reading Time**: Estimated reading time calculation

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting with Prettier
- `pnpm prepare` - Setup Husky git hooks (runs automatically after install)

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy with automatic builds on every push

### Other Platforms

- **Netlify**: Use the `pnpm build` command and deploy the `.next` folder
- **Docker**: Create a Dockerfile based on the [Next.js Docker example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- **Traditional Hosting**: Build static files with `pnpm build` and serve the output

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🎓 Learning Resources

### Next.js & React

- [Next.js Documentation](https://nextjs.org/docs) - Comprehensive Next.js guide
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial
- [React Documentation](https://react.dev/) - Official React docs

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Complete TypeScript guide
- [Next.js with TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript) - TypeScript integration

### Styling & UI

- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [shadcn/ui Documentation](https://ui.shadcn.com/) - Component library guide
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Radix UI](https://www.radix-ui.com/) - Unstyled UI primitives

### Content & MDX

- [MDX Documentation](https://mdxjs.com/) - Markdown with React components
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Front matter parsing

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**

```bash
pnpm lint
pnpm build
```

**Styling issues:**

- Clear `.next` cache: `rm -rf .next`
- Restart development server: `pnpm dev`

**MDX content not loading:**

- Check file paths in `content/challenges/`
- Verify MDX frontmatter format
- Check for syntax errors in MDX files

### Getting Help

1. **Search existing issues** in the repository
2. **Check the documentation** for relevant sections
3. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node.js version)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Types of Contributions

- 🐛 **Bug Reports**: Found a bug? Let us know!
- 💡 **Feature Requests**: Have an idea? Share it!
- 📝 **Documentation**: Help improve the docs
- 🎨 **Design**: UI/UX improvements
- 🗺 **Challenges**: New coding challenges (see below)

### For Platform Development

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Test your changes**: `pnpm lint && pnpm build`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### For Challenge Content

Challenges are managed in a separate repository:

- **Repository**: [youbuildit/challenges](https://github.com/youbuildit/challenges)
- **Content Issues**: Report typos, errors, or improvements
- **New Challenges**: Submit new challenge ideas or implementations

### Development Guidelines

- **Code Style**: Follow existing patterns and use ESLint
- **TypeScript**: Maintain type safety, avoid `any` types
- **Components**: Create reusable, accessible components
- **Performance**: Consider loading times and bundle size
- **Accessibility**: Follow WCAG guidelines
- **Responsive Design**: Ensure mobile compatibility

### Development Workflow

The project uses automated tools to maintain code quality:

- **Pre-commit Hooks**: Husky automatically runs ESLint and Prettier on staged files before each commit
- **Staged Files**: lint-staged ensures only modified files are processed, improving performance
- **Automatic Formatting**: Code is automatically formatted with Prettier during the pre-commit process
- **Lint Fixes**: ESLint auto-fixes are applied when possible during pre-commit

### Commit Convention

We use conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## 📜 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts by [Vercel](https://vercel.com/font)

---

**Ready to build something amazing?** 🚀 [Start with your first challenge!](https://youbuildit.vercel.app/challenges)
