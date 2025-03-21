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
- **Document Processing**: Extract information from forms and documents using Azure AI Document Intelligence
- **Coaching Insights**: AI-generated observations and action suggestions for personalized support
- **Interactive Dashboard**: Filter and sort participants by employment stage and view key statistics
- **Calendar Integration**: Coordinate and track sessions with participants

- ### Solution to problematics

| **Problematics**                          | **Solutions**                                                      |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Struggling to manage administrative tasks | Calendar, Group of tables and forms (Sessions, Participants, Jobs) |
| Personalized support                      | Job Suggestions / AI Insights                                      |
| Real-time problem-solving                 | Job Suggestions / AI Insights                                      |


## Architecture

WorkAble AI leverages multiple Azure services to deliver a comprehensive solution:

![Alt Text](https://github.com/ferDMS/ms-challenge/blob/Jose/ArquitecturaWorkabeAIFondo.png)

- **Azure AI Search:** Enhances job matching by efficiently retrieving job opportunities based on participant's information.
- **Azure Cosmos DB:** Stores unstructured data about participants, and job opportunities (json files).
- **Azure Blob Storage:** Manages unstructured document storage such as session recordings.
- **Azure Container Instances:** Deploys backend and frontend applications using Docker containers.
- **Azure Container Registry:** Stores and manages container images for streamlined deployment.
- **Azure GitHub Actions:** Automates build, test, and deployment pipelines for continuous integration and delivery.
- **AI Speech:** Provides speech recognition capabilities for analyzing meeting conversations.
- **AI Language:** Supports natural language processing for extracting insights from conversations given by meetings.
- **Microsoft Outlook Calendar:** Integrates calendar data to manage sessions and schedule meetings.
- **React and Fluent UI:** Builds the user-friendly frontend application.
- **Flask and Python:** Power the backend API to handle data processing and AI interactions.

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
