# WorkAble AI: Empowering Job Coaches, Enabling Careers

![Preseting Workable AI](./assets/main_page_rounded.png)

## Overview

WorkAble AI is an intelligent platform designed to support employment coaches who work with people with disabilities. By leveraging Azure AI services, the system enhances coach productivity, streamlines administrative tasks, and improves job matching outcomes. Our solution addresses the critical challenge faced by supported employment programs: limited resources for job coaches who must simultaneously manage documentation, deliver personalized training, solve emerging problems, and provide motivational support to participants.

Through intelligent automation and AI-powered insights, WorkAble AI allows coaches to focus more on meaningful interactions with participants and less on administrative burdens, ultimately improving employment outcomes for people with disabilities.

![Workable AI Dashboard](./assets/dashboard_rounded.png)

## Key Features

- **Participant Management**: Complete profiles with skills, preferences, and employment history
- **Smart Session Management**: Schedule, record, and analyze coaching sessions
- **Intelligent Job Matching**: AI-powered recommendations based on participants' abilities and preferences
- **Coaching Insights**: AI-generated observations and action suggestions for personalized support
- **Interactive Dashboard**: Filter and sort participants by employment stage and view key statistics
- **Calendar Integration**: Coordinate and track sessions with participants

### Solution to problematics

| **Problematics**                          | **Solutions**                                                      |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Struggling to manage administrative tasks | Calendar, Group of tables and forms (Sessions, Participants, Jobs) |
| Personalized support                      | Job Suggestions / AI Insights                                      |
| Real-time problem-solving                 | Job Suggestions / AI Insights                                      |


## Architecture / Tech Stack

WorkAble AI leverages multiple Azure services to deliver a comprehensive solution:

![Alt Text](./assets/architecture_rounded.png)

### Repo

Serves as the central code repository, housing both the frontend and backend code. Ensures version control and collaborative development workflows.

- **GitHub**: Stores and manages the codebase, issues, and pull requests.  
- **Next.js / React**: Frontend framework and library for building interactive user interfaces.  
- **Fluent UI**: Provides a consistent design language and UI components.  
- **Flask / Python**: Backend framework and language for handling server-side logic and API routes.  
- **Docker**: Containerizes the application for consistent and portable deployments.

### Deployment

Automates building, testing, and deploying both the frontend and backend. Ensures the latest code changes are continuously integrated and delivered.

- **GitHub Actions**: Automates CI/CD pipelines (build, test, and deploy).  
- **Azure Container Registry**: Stores Docker images for the frontend and backend.  
- **Azure Container Instances**: Hosts and runs the containerized applications in a managed environment.

---

### Storage

Manages structured and unstructured data, including documents, media, and user information. Ensures secure, scalable data access for the platform.

- **Azure Blob Storage**: Stores unstructured data such as session recordings and uploaded files.  
- **Azure Cosmos DB**: Stores participant profiles, job listings, and other structured data in a NoSQL format.

---

### Job Match

Analyzes participant profiles and job listings to provide intelligent job recommendations. Leverages AI-driven search and language models to match skills and preferences accurately.

- **Azure AI Search**: Retrieves and ranks relevant job postings based on participant data.  
- **OpenAI / GPT-based Models**: Enhances job-matching logic with advanced language understanding.


### Meeting Analysis
  
Transcribes and processes meeting conversations for insights and action items. Assists job coaches by generating real-time suggestions and storing key discussion points.

- **AI Speech**: Converts spoken content into text for further analysis.  
- **AI Language**: Extracts entities, sentiments, and insights from transcribed text.  
- **Calendar Integration**: Synchronizes meeting schedules and notifications with Microsoft Outlook.

---

## Responsable AI

Microsoft has established seven core principles to ensure the responsible development and deployment of AI technologies. Below is a table outlining these principles and their presence in the development of the project.

| **Problematics**                 | **Solutions**                                                      |
|----------------------------------|-------------------------------------------------------------------|
| Fairness                         |                                                                   |
| Reliability and Safety           |                                                                   |
| Privacy and Security             |                                                                   |
| Inclusiveness                    |                                                                   |
| Transparency                     |                                                                   |
| Accountability                   |                                                                   |
| Human Control and Oversight     |                                                                   |

## Getting Started

### Prerequisites

- Azure account with necessary services provisioned
- Node.js (v16 or later)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/workable-ai.git
cd workable-ai
```

2. Install dependencies for both frontend and backend:

```bash
# Frontend
cd app/frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables:

```bash
# Create .env files from examples
cp app/frontend/.env.example app/frontend/.env
cp app/backend/.env.example app/backend/.env
```

4. Update the environment variables with your Azure service credentials.

5. Start the development servers:

```bash
# Frontend
cd app/frontend
npm run dev

# Backend
cd ../backend
npm run dev
```

The application will be available at http://localhost:3000.

## Development

### Project Structure

```
/app
  /frontend        # Next.js React application
  /backend         # API services and Azure integrations
/docs              # Documentation and guides
/infra             # Infrastructure deployment templates
```


## Resources

- [Environment Setup Guide](./docs/environment-setup.md)
- [Azure AI Search](https://learn.microsoft.com/azure/search/search-what-is-azure-search)
- [Supported Employment Best Practices](./docs/supported_employment/)
