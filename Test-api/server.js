// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Data
const token = "170dd35c8293c68388bd97f831a8e9c4b03d550";
const projects = [
  { id: 300, name: "Requests", type: "request" },
  { id: 265, name: "Maintenance", type: "maintenance" }
];

const radios = {
  maintenance: [
    {
      task_id: 298,
      radio: {
        key: 1234,
        name: "Radio Horizonte 103.1",
        admin_url: "http://sample.url.com/1234",
        resources: { facebook: "http://www.facebook.com/pg/radiohorizonte103.1" },
        pipeline: "broken",
        events: [
          { name: "Snoozed: Stream not working on station website", date: "2021-06-06T10:25:27" }
        ],
        country: "Brazil",
        state: "São Paulo",
        city: "São Paulo",
        creation_date: "2021-05-01T09:00:00"
      }
    }
  ],
  request: [
    {
      task_id: 299,
      radio: {
        key: 5678,
        name: "Radio FM 96.5 Power Station",
        admin_url: "http://sample.url.com/5678",
        resources: { twitter: "http://twitter.com/radiofm965", facebook: "http://www.facebook.com/radiofm965" },
        pipeline: "active",
        events: [
          { name: "Stream Delay: Buffering Issues", date: "2025-01-16T10:25:00" }
        ],
        country: "USA",
        state: "California",
        city: "Los Angeles",
        creation_date: "2024-07-15T08:30:00"
      }
    }
  ]
};

let completedTasksCount = 0;

// Helper Functions
const findProjectById = (projectId) => projects.find(p => p.id === projectId);
const getNextRadio = (type) => radios[type][0]; // Simplified for demo; expand as needed.

// Routes

// Authentication endpoint
app.post('/api/v1/api-token-auth/', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'pass') {
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware to validate Authorization header
const validateAuthHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Token ${token}`) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};

// Apply the middleware globally to all routes
app.use(validateAuthHeader);


// Get available project
app.get('/api/v1/projects/get-projects', (req, res) => {
  res.json({ status: "success", projects });
});

// Get current radio information
app.get('/api/v1/projects/:project_id/current-radio', (req, res) => {
  const projectId = parseInt(req.params.project_id, 10);
  const project = findProjectById(projectId);

  if (project) {
    return res.json(getNextRadio(project.type));
  }
  res.status(404).json({ error: "Project not found" });
});

// Mark current radio as completed and get the next one
app.post('/api/v1/projects/:project_id/complete-radio', (req, res) => {
  const { task_id } = req.body;
  const projectId = parseInt(req.params.project_id, 10);
  const project = findProjectById(projectId);

  if (project && task_id === getNextRadio(project.type).task_id) {
    completedTasksCount++;
    radios[project.type].push(radios[project.type].shift()); // Rotate for demo
    return res.json(getNextRadio(project.type));
  }
  res.status(400).json({ error: "Invalid task ID or project" });
});

// Snooze the current radio
app.post('/api/v1/projects/:project_id/snooze-radio', (req, res) => {
  const { task_id } = req.body;
  const projectId = parseInt(req.params.project_id, 10);
  const project = findProjectById(projectId);

  if (project && task_id === getNextRadio(project.type).task_id) {
    return res.json({ status: "success", message: "Radio snoozed" });
  }
  res.status(400).json({ error: "Invalid task ID or project" });
});

// Get completed task count
app.get('/api/task-count', (req, res) => {
  res.json({ completedTasks: completedTasksCount });
});


app.get('/api/history', (req, res) => {
  const historyResponse = {
      status: "success",
      period_start: "2025-02-18T19:57:35.920699Z",
      period_end: "2025-02-25T19:57:36.402708Z",
      history: [
          {
              type: "radio",
              radio: {
                  key: 16668,
                  name: "SheetMusicDB - Ensembles",
                  website: "http://sheetmusicdb.net/",
                  resources: {
                      facebook: "http://www.facebook.com/sheetmusicdb"
                  },
                  pipeline: "snoozed",
                  admin_url: "https://admin.com/16668/",
                  events: [
                      {
                          name: "Snoozed: Stream not working on station website",
                          date: "2019-04-02T03:53:53"
                      },
                      {
                          name: "Snoozed: Station website down",
                          date: "2019-04-02T03:53:53"
                      }
                  ],
                  country: "Austria",
                  created: "2009-11-25T03:19:56",
                  request_type: ""
              },
              date_reviewed: "2025-02-25T19:40:21.845498Z",
              project_name: "MaintenanceAlwaysOn"
          },
          {
              type: "request",
              radio: {
                  key: 56422,
                  name: "Blue 100.7",
                  website: "https://bluefm.com.ar/",
                  resources: "https://bluefm.com.ar/",
                  pipeline: "Active",
                  admin_url: "https://admin.com/56422/",
                  events: [],
                  country: "Argentina",
                  created: "2023-05-04T08:22:22",
                  request_type: "update"
              },
              date_reviewed: "2025-02-25T19:40:11.166056Z",
              project_name: "Some Request Project"
          },
          {
              type: "request",
              radio: {
                  key: 56440,
                  name: "Aspen 102.3",
                  website: "https://fmaspen.com/",
                  resources: "https://fmaspen.com/",
                  pipeline: "Active",
                  admin_url: "https://admin.com/56440/",
                  events: [],
                  country: "Argentina",
                  created: "2023-05-09T20:17:23",
                  request_type: "update"
              },
              date_reviewed: "2025-02-25T19:39:51.885370Z",
              project_name: "TestReqRef"
          },
          {
              type: "radio",
              radio: {
                  key: 34835,
                  name: "Radio Mangembo",
                  website: "http://www.mangembo-fm.com/",
                  resources: {
                      facebook: "http://www.facebook.com/Radio-Mangembo-388643574643084/"
                  },
                  pipeline: "broken",
                  admin_url: "https://admin.com/34835/",
                  events: [
                      {
                          name: "Snoozed: Station website down",
                          date: "2019-02-25T17:41:58"
                      }
                  ],
                  country: "France",
                  created: "2010-01-17T12:00:13",
                  request_type: ""
              },
              date_reviewed: "2025-02-25T19:39:46.377975Z",
              project_name: "brokentest"
          }
      ]
  };
  res.json({status: "success", historyResponse});
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
