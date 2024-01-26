# Contributing

First off, thanks for taking the time to contribute ❤!

PDFProView in early development (prototyping) stage, the codebase hasn't been optimized yet. It is gradually being refactored it, changing and breaking some things, so you might encounter a lot of code conflicts.

## Reporting Guidelines

### 🐞 Reporting Bugs or Problems

If you've identified a bug, encountered an issue, or stumbled upon a problem, we appreciate your diligence in bringing it to our attention. Before diving into the fix, please create an issue detailing the problem. This allows for discussion, collaboration, and ensures that efforts are coordinated.

#### How to Report a Bug:

- Go to the [Issues](https://github.com/OscarCasadoLorenzo/PDFProView/issues) section.
- Click on `New Issue`
- Select the `Bug Report` template.
- Provide a detailed description, steps to reproduce, and any relevant information.

### 💡 Proposing Ideas or Enhancements

Have a brilliant idea or an enhancement suggestion? Fantastic! Let's discuss it first to align with the project's goals and ensure it's the right fit. Share your thoughts by creating an issue and initiating a conversation.

#### How to Propose an Idea:

- Navigate to the [Issues](https://github.com/OscarCasadoLorenzo/PDFProView/issues) section.
- Click on `New Issue`
- Select the `Feature Request` template.
- Clearly outline your idea, its benefits, and any potential challenges.

## How to contribute

If you want to implement some changes into this project check the next steps for it:

### Repository setup

After a review, I will merge the changes into the project, if the changes are beneficial.

1.  Prerequisites:

- Node.js version: >= `v18.0.0`
- npm version: >= `v9.0.0`

  🔧 You can use tools like **nvm** to install and manage multiple Node versions

- Check or setup your git locally (for this project) or globally and set your `user.email` and `user.name`:

  ```bash
  git config --global user.name "FirstName LastName"
  git config --global user.email "email@gmail.com"
  ```

2. Download the project to your local computer:

```
git clone https://github.com/OscarCasadoLorenzo/PDFProView.git
```

3. Install the dependencies and start dev server:

```bash
cd /PDFProView
npm install -D --force
npm run dev
```

To build the project for your current platform, run this command:

```bash
npm run build
```

### Issues, Branches & Pull requests

#### ⚠ Before contributing

Create a new issue or a discussion and describe the feature / fix / changes you want to implement so we can discuss it first.

1. **Fork the repository**

   In the upper right corner of the [repository main page](https://github.com/OscarCasadoLorenzo/PDFProView), find the `Fork` button. Click on it.

2. **Clone your fork locally**

   ```bash
   git clone https://github.com/<your-username>/PDFProView.git
   ```

3. **Create a new branch based on the issue**

4. **Implement your changes**  
   ❗ This repository follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

5. **Submit a pull request, referencing the associated issue**

6. **Create the Pull Request**

   Visit your forked repository on GitHub. Click on the `Pull Requests` tab, then the `New Pull Request` button. GitHub will guide you through the process of creating a pull request to the original repository.  
   📑Do not forget to link the associated issue, for example: "Closes #1234"

7. **Enjoy your work 😎**  
   When a Pull Request is merged into develop branch you will be added in <u>contributors list</u>.

## 📚 Additional Resources

- [PDFProView Kanban Board](https://github.com/users/OscarCasadoLorenzo/projects/10)
