const USERS_URL = 'https://codeventure-data.onrender.com/users/'
const COURSES_URL = 'https://codeventure-data.onrender.com/courses/'

const progress = {
    getUserURL : function(){return USERS_URL+localStorage.getItem("user-id")},
    getCourseProgress : async function(course){
        const currCourse = await this.getCurrentCourse(course)
        const userProgress = currCourse['progress']['activities completed']
        const activityNum = course['activities'].length
        return Math.floor(userProgress / activityNum * 100)
    },
    getCurrentCourse : async function(course){
        const response = await fetch(this.getUserURL())
        const user = await response.json();
        return user['user courses']
            .find(function(userCourse){
                return userCourse['course name'] == course['name']
            })
    },
    getQuizScore : async function(course){
        const currCourse = await this.getCurrentCourse(course)
        return currCourse['progress']['quiz score']
    },
    updateCourseProgress : async function(userProgress, course){
        if(userProgress < parseInt(localStorage.getItem('current-activity-index'))+1){
                return fetch(this.getUserURL())
                .then(res => res.json())
                .then(user => {
                    user['user courses'].find(function(userCourse){
                        return userCourse['course name'] == course['name']
                    })
                    ['progress']
                    ['activities completed']++
                    return fetch(this.getUserURL(),{
                        method: "PUT",
                        headers: {
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify(user)
                    })
                })
        }
    },
    updateQuizScore : async function(score, course){
            return fetch(this.getUserURL())
            .then(res => res.json())
            .then(user => {
                user['user courses'].find(function(userCourse){
                    return userCourse['course name'] == course['name']
                })
                ['progress']['quiz score'] = score
        
                return fetch(this.getUserURL(),{
                    method:"PUT",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(user)
                })
            })
    }
}

const webContent = {
    getCourseURL : function(){return COURSES_URL+localStorage.getItem('course-id')},
    getCourse : async function(){
        const response = await fetch(this.getCourseURL())
        const c = response.json()
        return c
    },
    course : {
        getCourseName : async function(){
            const c = await webContent.getCourse()
            return c['name']
        },
        getCourseDesc : async function(){
            const c = await webContent.getCourse()
            return c['desc']
        },
        getActivities : async function(){
            const c = await webContent.getCourse()
            return c['activities']
        }
    },
    activity : {
        getActivity : async function(activityIndex){
            const c = await webContent.getCourse()
            return c['activities'][activityIndex]
        }
    }
}