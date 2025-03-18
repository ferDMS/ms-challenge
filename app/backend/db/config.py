# Database configuration settings

# Container definitions
CONTAINERS = {
    # 'participants': {
    #     'name': 'participants',
    #     'partition_key': '/id'
    # },
    # 'coaches': {
    #     'name': 'coaches',
    #     'partition_key': '/id'
    # },
    'sessions': {
        'name': 'sessions',
        'partition_key': '/id'
    },
    # 'jobs': {
    #     'name': 'jobs', 
    #     'partition_key': '/id'
    # },
    # 'job_matches': {
    #     'name': 'job_matches',
    #     'partition_key': '/participantId'
    # },
    # 'documents': {
    #     'name': 'documents',
    #     'partition_key': '/id'
    # }
}

# Database name
DB_NAME = 'ms-challenge'