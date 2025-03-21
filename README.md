# WorkAble AI: Empowering Job Coaches, Enabling Careers

![WorkAble AI Dashboard](https://placeholder-for-project-screenshot.com)

## Overview

WorkAble AI is an intelligent platform designed to support employment coaches who work with people with disabilities. By leveraging Azure AI services, the system enhances coach productivity, streamlines administrative tasks, and improves job matching outcomes. Our solution addresses the critical challenge faced by supported employment programs: limited resources for job coaches who must simultaneously manage documentation, deliver personalized training, solve emerging problems, and provide motivational support to participants.

Through intelligent automation and AI-powered insights, WorkAble AI allows coaches to focus more on meaningful interactions with participants and less on administrative burdens, ultimately improving employment outcomes for people with disabilities.

## Key Features

- **Participant Management**: Complete profiles with skills, preferences, and employment history
- **Smart Session Management**: Schedule, record, and analyze coaching sessions
- **Intelligent Job Matching**: AI-powered recommendations based on participants' abilities and preferences
- **Document Processing**: Extract information from forms and documents using Azure AI Document Intelligence
- **Coaching Insights**: AI-generated observations and action suggestions for personalized support
- **Interactive Dashboard**: Filter and sort participants by employment stage and view key statistics
- **Calendar Integration**: Coordinate and track sessions with participants

## Architecture

WorkAble AI leverages multiple Azure services to deliver a comprehensive solution:

- **Azure OpenAI**: Powers personalized recommendations and insights for coaches
- **Azure AI Search**: Enables efficient job matching and participant information retrieval
- **Azure AI Document Intelligence**: Extracts data from intake forms and documentation
- **Azure Cosmos DB**: Stores structured data about participants, sessions, and job opportunities
- **Azure App Service**: Hosts the web application frontend and backend APIs
- **Azure Blob Storage**: Manages document storage and retrieval

![Alt Text](https://github.com/ferDMS/ms-challenge/blob/Jose/ArquitecturaWorkabeAI.png)

## User Workflows

### For Job Coaches

1. **Participant Registration**: Add new participants manually or through document processing
2. **Session Management**: Schedule, record notes, and get AI-generated insights from coaching sessions
3. **Job Matching**: View automatically suggested jobs based on participant skills and preferences
4. **Progress Tracking**: Monitor participant progress through the employment cycle

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

### Key Components

- **Participant Dashboard**: View and manage participant information
- **Session Management**: Record and analyze coaching sessions
- **Job Listing**: Browse and assign job opportunities
- **Calendar View**: Manage upcoming sessions and availability

## Future Enhancements

- **Voice Transcription**: Automatic transcription and analysis of coaching sessions
- **Mobile Application**: Enable on-the-go access for job coaches working in the field
- **Advanced Analytics**: Deeper insights into coaching effectiveness and outcomes
- **Expanded Job Sources**: Integration with additional job boards and employment databases
- **Family Portal**: Secure access for families to view progress and contribute information

## Technology Stack

- **Frontend**: Next.js, TypeScript, Fluent UI React components
- **Backend**: Node.js, Express
- **AI/ML**: Azure OpenAI, Azure AI Document Intelligence
- **Data Storage**: Azure Cosmos DB, Azure Blob Storage
- **Search**: Azure AI Search

## Resources

- [Environment Setup Guide](./docs/environment-setup.md)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/cognitive-services/openai/overview)
- [Azure AI Search](https://learn.microsoft.com/azure/search/search-what-is-azure-search)
- [Supported Employment Best Practices](./docs/supported_employment/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
