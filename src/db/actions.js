module.exports = {
  "post": {
    "create": 30,
    "update": 0,
    "delete": -20,
    "read": 1
  },
  "like": {
    "create": 3,
    "delete": -3,
    "receive": 5
  },
  "dislike": {
    "create": -1,
    "delete": 1,
    "receive": -3
  },
  "comment": {
    "create": 5,
    "update": 0,
    "delete": -5,
    "read": 0,
    "receive": 1
  },
  "comment-reply": {
    "create": 1,
    "update": 0,
    "delete": -1,
    "read": 0,
    "receive": 1
  },
  "study": {
    "create": 50,
    "update": 0,
    "delete": -30,
    "join": 15
  },
  "question": {
    "create": 20,
    "update": 0,
    "delete": -10,
    "read": 1
  },
  "answer": {
    "create": 20,
    "update": 0,
    "delete": -10,
    "read": 1
  },
  "flag": {
    "create": -10,
    "update": 0,
    "delete": 10,
    "read": 0,
    "receive": -10
  }
}