import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import { db } from "./firestoreConfig";
import { vuexfireMutations, firestoreAction } from "vuexfire";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
    person: {},
    courses: [],
    topics: [],
    cohorts: [],
    organisations: [],
    people: [],
    currentCourseId: "",
    currentTopicId: "",
    currentTaskId: "",
    currentCohortId: "",
    currentCourse: {},
    currentTopic: {},
    currentTask: {},
    currentCohort: {},
    currentCourseNodes: [],
    currentCourseEdges: [],
    allNodes: [],
    allEdges: [],
    allNodesForDisplay: [],
    allTasks: [],
    personsNodes: [],
    personsNodesForDisplay: [],
    personsAssignedNodes: [],
    personsAssignedNodesForDisplay: [],
    personsEdges: [],
    personsAssignedEdges: [],
    personsTopics: [],
    topicsTasks: [],
    personsTopicsTasks: [],
    requestsForHelp: [],
    teachersSubmissionsToReview: [],
    teachersRequestsForHelp: [],
  },
  getters: {
    user: (state) => state.user,
    person: (state) => state.person,
    courses: (state) => state.courses,
    getCourseById: (state) => (id) => {
      return state.courses.find((course) => course.id === id);
    },
    getCoursesByWhoMadeThem: (state) => (personId) => {
      return state.courses.filter(
        (course) => course.mappedBy.personId == personId
      );
    },
    getTopicById: (state) => (id) => {
      const topic = state.topics.find((topic) => topic.id === id);
      return topic;
    },
    getPersonsTopicById: (state) => (id) => {
      const topic = state.personsTopics.find((topic) => topic.id === id);
      return topic;
    },
    getCohortById: (state) => (id) => {
      return state.cohorts.find((cohort) => cohort.id === id);
    },
    getOrganisationById: (state) => (id) => {
      return state.organisations.find((organisation) => organisation.id === id);
    },
    getTasksByTopicId: (state) => (topicId) => {
      const topic = state.topics.find((topic) => topic.id === topicId);
      return topic.tasks;
    },
    getTaskStatusByTaskId: (state) => (taskId) => {
      if (state.person.accountType != "student") {
        return;
      }
      // get topic status eg. unlocked / inreview / completed / locked
      const task = state.personsTopicsTasks.find(
        (topicTask) => topicTask.id === taskId
      );
      return task.taskStatus;
    },
    getPersonsTasksByTopicId: (state) => (id) => {
      if (state.personsTopics.length) {
        var topic = state.personsTopics.find((topic) => topic.id === id);
      } else
        var topic = {
          tasks: [],
        };
      return topic.tasks;
    },
    getCohortsByOrganisationId: (state) => (id) => {
      // TODO:
      if (id) {
        return state.cohorts.filter((cohort) => cohort.organisation === id);
      } else {
        return state.cohorts.filter((cohort) => cohort.organisation == "");
      }
    },
    getCohortsInThisCourse: (state) => (id) => {
      //go to cohorts, and check if they in courses with this id
      let cohortsInCourse = state.cohorts.filter((cohort) => {
        if (cohort.courses) {
          return cohort.courses.some((courseId) => courseId == id);
        } else {
          return false;
        }
      });
      return cohortsInCourse;
    },
    getOrganisationsInThisCourse: (state) => (id) => {
      let organisationsInCourse = state.organisations.filter((organisation) => {
        if (organisation.courses) {
          return organisation.courses.some((courseId) => courseId == id);
        } else {
          return false;
        }
      });
      return organisationsInCourse;
    },
    getPeopleInThisCourse: (state) => (id) => {
      let peopleInCourse = state.people.filter((person) => {
        if (person.assignedCourses) {
          return person.assignedCourses.some((courseId) => courseId == id);
        } else {
          return false;
        }
      });
      return peopleInCourse;
    },
    getCoursesInThisCohort: (state) => (id) => {
      //go to cohorts, and check if they in courses with this id
      const cohort = state.cohorts.find((cohort) => cohort.id === id);
      const cohortsCoursesArrOfObj = [];
      cohort.courses.forEach((courseId) => {
        const courseObj = state.courses.find((course) => course.id == courseId);
        cohortsCoursesArrOfObj.push(courseObj);
      });
      return cohortsCoursesArrOfObj;
    },
    getStudentsByCohortId: (state) => (id) => {
      //go to cohorts, and check if they in courses with this id
      let peopleInCohort = [];
      state.people.forEach((person) => {
        if (person.assignedCohorts) {
          // if student is assigned in this cohort...
          if (person.assignedCohorts.some((cohortId) => cohortId === id)) {
            // push them into array
            peopleInCohort.push(person);
          }
        }
      });
      return peopleInCohort;
    },
    //
    // completedCourses: (state) => {
    //   return state.courses.filter(course => course.status.completed)
    // }
  },
  mutations: {
    ...vuexfireMutations,
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_PERSON(state, data) {
      state.person = data;
    },
    setCurrentCourseId(state, courseId) {
      state.currentCourseId = courseId;
    },
    setCurrentCourse(state, course) {
      state.currentCourse = course;
    },
    setCurrentTopicId(state, topicId) {
      state.currentTopicId = topicId;
    },
    setCurrentTopic(state, topic) {
      state.currentTopic = topic;
    },
    setCurrentTaskId(state, taskId) {
      state.currentTaskId = taskId;
    },
    setCurrentTask(state, task) {
      state.currentTask = task;
    },
    setCurrentCohortId(state, cohortId) {
      state.currentCohortId = cohortId;
    },
    setCurrentCohort(state, cohort) {
      state.currentCohort = cohort;
    },
    updateAllNodes(state, newNodePositions) {
      state.allNodes = newNodePositions;
    },
    updateAllNodesForDisplay(state, newNodePositions) {
      state.allNodesForDisplay = newNodePositions;
    },
    updatePersonsNodesForDisplay(state, newNodePositions) {
      state.personsNodesForDisplay = newNodePositions;
    },
    updatePersonsAssignedNodesForDisplay(state, newNodePositions) {
      state.personsAssignedNodesForDisplay = newNodePositions;
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          admin: user.admin,
          displayName: user.displayName,
          email: user.email,
          id: user.uid,
        });
      } else {
        commit("SET_USER", null);
      }
    },
    // ===== Firestore - BIND ALL
    bindAllCourses: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef("courses", db.collection("courses"), {
        maxRefDepth: 2,
      });
    }),
    bindAllCohorts: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef("cohorts", db.collection("cohorts"));
    }),
    bindAllOrganisations: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef("organisations", db.collection("organisations"));
    }),
    bindAllPeople: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef("people", db.collection("people"));
    }),
    bindCourseNodes: firestoreAction(({ bindFirestoreRef }, id) => {
      return bindFirestoreRef(
        "currentCourseNodes",
        db.collection("courses").doc(id).collection("map-nodes")
      );
    }),
    bindCourseEdges: firestoreAction(({ bindFirestoreRef }, id) => {
      return bindFirestoreRef(
        "currentCourseEdges",
        db.collection("courses").doc(id).collection("map-edges")
      );
    }),
    bindCourseTopics: firestoreAction(({ bindFirestoreRef }, id) => {
      return bindFirestoreRef(
        "topics",
        db.collection("courses").doc(id).collection("topics")
      );
    }),
    async getAllNodes({ state }) {
      const allNodes = [];

      const querySnapshot = await db.collection("courses").get();

      let count = 0;

      // get the topics (nodes) in that course
      for (const doc of querySnapshot.docs) {
        const subQuerySnapshot = await db
          .collection("courses")
          .doc(doc.id)
          .collection("map-nodes")
          .get();

        allNodes.push(
          ...subQuerySnapshot.docs.map((subDoc) => {
            const node = subDoc.data();
            node.courseId = doc.id; // add course id to nodes list for some reason
            //node.group = count; // add group to nodes list for some reason
            return node;
          })
        );
        count++;
      }
      // console.log("all nodes from Firestore: ", allNodes);
      state.allNodes = allNodes; // source of truth
      state.allNodesForDisplay = allNodes; // store all nodes
    },
    async getAllEdges({ state }) {
      const allEdges = [];
      const querySnapshot = await db.collection("courses").get();

      for (const doc of querySnapshot.docs) {
        // doc.data() is never undefined for query doc snapshots
        const subQuerySnapshot = await db
          .collection("courses")
          .doc(doc.id)
          .collection("map-edges")
          .get();

        allEdges.push(...subQuerySnapshot.docs.map((subDoc) => subDoc.data()));
      }

      state.allEdges = allEdges;
    },
    async getCourseFromFirestoreById({ state }, id) {
      await db
        .collection("courses")
        .doc(id)
        .get()
        .then((doc) => {
          state.courses.push({ ...doc.data(), id: doc.id });
        });
    },
    // ===== Firestore - BIND by USER
    async getPersonById({ commit }, id) {
      if (id) {
        console.log('setting person: ', id)
        await db
          .collection("people")
          .doc(id)
          .get()
          .then((doc) => {
            commit("SET_PERSON", doc.data())
          });
      } else {
        commit("SET_PERSON", {})
      }
    },
    async getNodesByPersonId({ state }, personId) {
      const personsNodes = [];

      const querySnapshot = await db
        .collection("courses")
        .where("mappedBy.personId", "==", personId)
        .get();
      // let count = 0; // if counting groups
      // get the topics (nodes) in that course
      for (const doc of querySnapshot.docs) {
        const subQuerySnapshot = await db
          .collection("courses")
          .doc(doc.id)
          .collection("map-nodes")
          .get();

        personsNodes.push(
          ...subQuerySnapshot.docs.map((subDoc) => {
            const node = subDoc.data();
            node.courseId = doc.id; // add course id to nodes list for some reason
            //node.group = count; // add group to nodes list for some reason
            // node.color = stringToColour(node.label)
            return node;
          })
        );

        // count++;
      }
      state.personsNodes = personsNodes; // source of truth
      state.personsNodesForDisplay = personsNodes; // store all nodes
    },
    async getAssignedNodesByPersonId({ state }, personId) {
      const personsAssignedNodes = [];
      
      state.courses = []
      // get the courseId from assignedCourses
      const doc = await db.collection("people").doc(personId).get();
      // loop array of assigned courses
      if (doc.data()?.assignedCourses) {
        for (const courseId of doc.data()?.assignedCourses) {
          // add assigned course to state.courses
          this.dispatch("getCourseFromFirestoreById", courseId);


          const subQuerySnapshot = await db
            .collection("courses")
            .doc(courseId)
            .collection("map-nodes")
            .get();

          //TODO: this only pushes nodes. not the course info

          personsAssignedNodes.push(
            ...subQuerySnapshot.docs.map((subDoc) => {
              const node = subDoc.data();
              node.courseId = courseId; // add course id to nodes list for some reason
              //node.group = count; // add group to nodes list for some reason
              // node.color = stringToColour(node.label)
              return node;
            })
          );
        }
      }
      state.personsAssignedNodes = personsAssignedNodes; // source of truth
      state.personsAssignedNodesForDisplay = personsAssignedNodes; // store all nodes
    },
    async getEdgesByPersonId({ state }, personId) {
      const personsEdges = [];

      const querySnapshot = await db
        .collection("courses")
        .where("mappedBy.personId", "==", personId)
        .get();

      for (const doc of querySnapshot.docs) {
        // doc.data() is never undefined for query doc snapshots
        const subQuerySnapshot = await db
          .collection("courses")
          .doc(doc.id)
          .collection("map-edges")
          .get();

        personsEdges.push(
          ...subQuerySnapshot.docs.map((subDoc) => {
            const edge = subDoc.data();
            // edge.color = '#848484'
            return edge;
          })
        );
      }

      state.personsEdges = personsEdges;
    },
    async getAllSubmittedWorkForTeacher({ state }) {
      const myCourses = this.getters.getCoursesByWhoMadeThem(state.person.id);

      const allWorkForReview = [];
      for (const course of myCourses) {
        // get all work for review
        const querySnapshot = await db
          .collection("courses")
          .doc(course.id)
          .collection("submissionsForReview")
          .where("taskSubmissionStatus", "==", "inreview")
          .orderBy("taskSubmittedTimestamp")
          .get();

        for (const doc of querySnapshot.docs) {
          allWorkForReview.push(doc.data());
        }
      }
      state.teachersSubmissionsToReview = allWorkForReview;
    },
    async getAssignedEdgesByPersonId({ state }, personId) {
      const personsAssignedEdges = [];
      // get the courseId from assignedCourses
      const doc = await db.collection("people").doc(personId).get();
      // loop array of assigned courses
      if (doc.data().assignedCourses) {
        for (const courseId of doc.data().assignedCourses) {
          const subQuerySnapshot = await db
            .collection("courses")
            .doc(courseId)
            .collection("map-edges")
            .get();

          personsAssignedEdges.push(
            ...subQuerySnapshot.docs.map((subDoc) => {
              const edge = subDoc.data();
              return edge;
            })
          );
        }
      }
      state.personsAssignedEdges = personsAssignedEdges; // source of truth
    },

    bindCoursesByPersonId: firestoreAction(({ bindFirestoreRef }, personId) => {
      return bindFirestoreRef(
        "courses",
        db.collection("courses").where("mappedBy.personId", "==", personId)
      );
    }),
    bindThisPersonsCourseTopics: firestoreAction(
      ({ bindFirestoreRef }, payload) => {
        return bindFirestoreRef(
          "personsTopics",
          db
            .collection("people")
            .doc(payload.personId)
            .collection(payload.courseId)
        );
      }
    ),
    // bind tasks by topic id
    bindTasksByTopicId: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "topicsTasks",
        db
          .collection("courses")
          .doc(payload.courseId)
          .collection("topics")
          .doc(payload.topicId)
          .collection("tasks")
          .orderBy("timestamp") // this is important to ordering the tasks in MissionList.vue
      );
    }),
    // bind persons tasks by topic id
    bindPersonsTasksByTopicId: firestoreAction(
      ({ bindFirestoreRef }, payload) => {
        return bindFirestoreRef(
          "personsTopicsTasks",
          db
            .collection("people")
            .doc(payload.personId)
            .collection(payload.courseId)
            .doc(payload.topicId)
            .collection("tasks")
            .orderBy("timestamp")
        );
      }
    ),
    async getTaskByTaskId({ state }, payload) {
      console.log("payload from getTaskByTaskId", payload);
      await db
        .collection("courses")
        .doc(payload.courseId)
        .collection("topics")
        .doc(payload.topicId)
        .collection("tasks")
        .doc(payload.taskId)
        .get()
        .then((doc) => {
          return doc.data();
        });
    },
    // bind courses requests for help
    bindRequestsForHelp: firestoreAction(({ bindFirestoreRef }, payload) => {
      return bindFirestoreRef(
        "requestsForHelp",
        db
          .collection("courses")
          .doc(payload.courseId)
          // .collection("topics")
          // .doc(payload.topicId)
          // .collection("tasks")
          // .doc(payload.taskId)
          .collection("requestsForHelp")
          .orderBy("requestSubmittedTimestamp")
      );
    }),
    // bind courses requests for help
    bindSpecificTeachersRequestsForHelp: firestoreAction(
      ({ bindFirestoreRef }, personId) => {
        // const myCourses = this.getters.getCoursesByWhoMadeThem(personId);

        return bindFirestoreRef(
          "teachersRequestsForHelp",
          db
            .collection("courses")
            .where("mappedBy.personId", "==", personId)
            .collection("requestsForHelp")
            .where("requestsForHelpStatus", "==", "unanswered")
          // .doc(payload.topicId)
          // .collection("tasks")
          // .doc(payload.taskId)
          // .collection("requestsForHelp")
          // .orderBy("timestamp")
        );
      }
    ),
    async getRequestsForHelpByTeachersId({ state }, personId) {
      const myCourses = this.getters.getCoursesByWhoMadeThem(personId);

      const allRequestsForHelp = [];
      for (const course of myCourses) {
        // get all work for review
        const querySnapshot = await db
          .collection("courses")
          .doc(course.id)
          .collection("requestsForHelp")
          .where("requestForHelpStatus", "==", "unanswered")
          // .orderBy("requestSubmittedTimestamp")
          .get();

        for (const doc of querySnapshot.docs) {
          allRequestsForHelp.push(doc.data());
        }
      }
      state.teachersRequestsForHelp = allRequestsForHelp;
    },
    // TODO: Consider putting this into a mixin or somewhere else as it doesnt have anything to do with the store
    async getPersonByIdFromDB({ state }, personId) {
      const person = await db.collection("people").doc(personId).get();
      return person.data();
    },
  },
  plugins: [createPersistedState()]
});

// colour functions to colour nodes
function hashCode(str) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function stringToColour(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 70%)`;
}
