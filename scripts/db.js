const USERS_URL = 'http://localhost:3000/users/'
const COURSES_URL = 'http://localhost:3000/courses/'

const progress = {
    getUserURL : function(){return USERS_URL+localStorage.getItem("user-id")},
    getCourseProgress : async function(course){
        const currCourse = await this.getCurrentCourse(course)
        const userProgress = currCourse['progress']['activities completed']
        const activityNum = course['activities'].length
        // console.log(currCourse['progress']['activities completed'])
        // console.log("uProgress: "+userProgress)
        // console.log("Activity Num: "+activityNum)
        return Math.floor(userProgress / activityNum * 100)
    },
    getCurrentCourse : async function(course){
        const response = await fetch(this.getUserURL())
        const user = await response.json();
        // console.log(course)
        return user['user courses']
            .find(function(userCourse){
                return userCourse['course name'] == course['name']
            })
    },
    getQuizScore : async function(course){
        const currCourse = await this.getCurrentCourse(course)
        return currCourse['progress']['quiz score']
    },
    updateCourseProgress : async function(course){
        try{
            const response = await fetch(this.getUserURL())
            const user = await response.json()
            user['user courses'].find(function(userCourse){
                return userCourse['course name'] == course['name']
            })
            ['progress']
            ['activities completed']++
        
            fetch(this.getUserURL(),{
                method:'PUT',
                body: JSON.stringify(user)
            })
        } catch (e){
            console.error("ERROR")
            console.error(e)
        }
    },
    updateQuizScore : async function(score, course){
        try{
            const response = await fetch(this.getUserURL())
            const user = await response.json()
            user['user courses'].find(function(userCourse){
                return userCourse['course name'] == course['name']
            })
            ['progress']['quiz score'] = score
    
            fetch(this.getUserURL(),{
                method:'PUT',
                body: JSON.stringify(user)
            })
        } catch (e){
            console.error("ERROR")
            console.error(e)
        }
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
    },
    quiz : {

    },
}

const auth = {

}