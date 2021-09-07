import { Task } from "./task.js";

const createNewGroupBtn = document.querySelector(`#btnGroupPop`)
const createNewTaskBtn = document.querySelector(`#btnTaskPop`)
const cancelCreateGroupBtn = document.querySelector(`#cancelGroup`)
const cancelCreateTaskBtn = document.querySelector(`#cancelTask`)
const popOver = document.querySelector(`#popover`)
const selectGroup = document.querySelector(`#selectGroup`)
const createTaskInput = document.querySelector(`#createTaskInput`)
const createGroupInput = document.querySelector(`#createGroupInput`)
const createGroupBtn = document.querySelector(`#createGroup`)
const createTaskBtn = document.querySelector(`#createTask`)
const taskRequired = document.querySelector(`.task-required`)
const groupRequired = document.querySelector(`.group-required`)
const TASKNAME = `task.lists`
const GROUPNAME = `groups.name`
const tasksCard = document.querySelector(`.tasks-card`)
const completedCard = document.querySelector(`.completed-card`)
const groupsCard = document.querySelector(`.groups-card`)
const groupsChart = document.querySelector(`.groups-chart`)
const groupTemplate = document.querySelector(`#group-template`)

const chartDescCompleted = groupsChart.querySelector(`.groups-chart__desc-completed`)
const chartDescUncompleted = groupsChart.querySelector(`.groups-chart__desc-uncompleted`)
const chartDescTotal = groupsChart.querySelector(`.groups-chart__desc-total`)


const progressCircle = document.querySelector(`.progress`)
const radius = progressCircle.r.baseVal.value
const circumference = Math.round(2 * Math.PI * radius)

let completedCount = 0

let total
let completedTask

//Set Date
const dateTitle = document.querySelector(`.welcome--title__date`)
const options = { weekday: 'long', day: "numeric", month: `long` }
let date = new Date()
let todaysDate = new Intl.DateTimeFormat(`en-US`, options).format(date)
dateTitle.textContent = todaysDate

const savedTasks = JSON.parse(localStorage.getItem(TASKNAME))

let tasks = returnSavedTask()
let groups = JSON.parse(localStorage.getItem(GROUPNAME)) || []

function createEmptyState(textContent) {
    const emptyStateTemplate = document.querySelector(`#empty-state`)
    const emptyStateElement = document.importNode(emptyStateTemplate.content, true)
    const emptyStatePTag = emptyStateElement.querySelector(`.empty-state`)
    emptyStatePTag.textContent = textContent
    return emptyStatePTag
}

const GROUPSEMPTY = `You have not created any group. Create group to see them here.`
const TASKEMPTY = `You have not created any task. Create task to see them here.`
const COMPLETEDEMPTY = `You have not completed any task. Complete a task to see them here.`

function setGroupCardEmptyState() {
    if (groups.length === 0) {
        groupsCard.insertAdjacentElement(`afterbegin`, createEmptyState(GROUPSEMPTY))
    }
}

function removeGroupEmptyState() {
    if (groupsCard.firstChild.className === `empty-state`) groupsCard.firstChild.remove()
}

const completed = document.querySelector(`.completed`)

function taskCompletedStatus(isComplete) {
    const taskStatus = tasks.filter(item => item.isComplete === isComplete)
    return taskStatus
}

function setTaskCardEmptyState() {
    if (tasks.length === 0 || taskCompletedStatus(true).length === tasks.length) {
        tasksCard.insertAdjacentElement(`afterbegin`, createEmptyState(TASKEMPTY))
    }

    if (tasks.length === 0) completed.hidden = true
}

function removeTaskEmptyState() {
    if (tasksCard.firstChild.className === `empty-state`) {
        tasksCard.firstChild.remove()

        completed.hidden = false
        return
    }

    setTaskCardEmptyState()
}

function setCompletedEmptyState() {
    if (taskCompletedStatus(false).length === tasks.length) {
        completedCard.insertAdjacentElement(`afterbegin`, createEmptyState(COMPLETEDEMPTY))
    }
}

function removeCompletedEmptyState() {
    if (completedCard.lastElementChild?.className === `empty-state`) {
        completedCard.lastElementChild.remove()
        return
    }

    setCompletedEmptyState()
}

function returnSavedTask() {
    if (savedTasks === null) return []

    let tasksFromStorage = savedTasks.map(item => {
        let { name, group, isComplete, id } = item
        return new Task(name, group, isComplete, id)
    })

    return tasksFromStorage
}

function render() {
    renderTaskDOM()
    renderGroupDOM()
    setGroupCardEmptyState()
    setTaskCardEmptyState()
    setCompletedEmptyState()
}
render()


selectGroup.addEventListener(`click`, () => {
    if (selectGroup.value === ``) {
        selectGroup.classList.add(`placeholder-active`)
        // return
    }
    selectGroup.classList.remove(`placeholder-active`)
})

function setPopOver(e) {
    e.stopPropagation()

    popOver.classList.add(`pop`)
    const targetElement = e.target

    switch (targetElement) {
        case createNewTaskBtn:
            popOver.classList.remove(`g`)
            break

        case createNewGroupBtn:
            popOver.classList.remove(`t`)
            break

        case cancelCreateTaskBtn:
            popOver.classList.add(`g`)
            popOver.classList.remove(`pop`)

            clearTaskForm()
            resetTaskRequiredStatus()
            break

        case cancelCreateGroupBtn:
            popOver.classList.add(`t`)
            popOver.classList.remove(`pop`)

            clearTaskForm()
            resetGroupRequiredStatus()
            break

        case popOver:
            targetElement.classList.contains(`t`) ? resetTaskRequiredStatus() : resetGroupRequiredStatus()
            targetElement.classList.contains(`t`) ? targetElement.classList.add(`g`) : targetElement.classList.add(`t`)
            popOver.classList.remove(`pop`)

            // targetElement.classList.contains(`t`) ? resetTaskRequiredStatus() : resetGroupRequiredStatus()
            clearTaskForm()
            break
    }
}

createNewTaskBtn.addEventListener(`click`, setPopOver)
createNewGroupBtn.addEventListener(`click`, setPopOver)
cancelCreateTaskBtn.addEventListener(`click`, setPopOver)
cancelCreateGroupBtn.addEventListener(`click`, setPopOver)
popOver.addEventListener(`click`, setPopOver)

function clearTaskForm() {
    if (createTask.value === ``) return
    createTaskInput.value = null
    selectGroup.value = ``
}

function clearGroupForm() {
    if (createGroup.value === ``) return
    createGroupInput.value = null
}

function resetTaskRequiredStatus() {
    taskRequired.classList.remove(`error`)
    taskRequired.textContent = `Required`
}

function resetGroupRequiredStatus() {
    groupRequired.classList.remove(`error`)
    groupRequired.textContent = `Required`
}

function createTask(e) {
    e.stopPropagation()

    if (createTaskInput.value === `` || null) {
        taskRequired.classList.add(`error`)
        taskRequired.textContent = `Task name is required!`

        return
    }

    function setID() {
        let id = tasks.length
        return id
    }

    const task = new Task(createTaskInput.value, selectGroup.value, false, setID())
    tasks.push(task)

    updateChartCount()

    clearTaskForm()
    resetTaskRequiredStatus()

    saveTask()

    task.createTaskDOM()

    removeTaskEmptyState()

    popOver.classList.add(`g`)
    popOver.classList.remove(`pop`)
}

createTaskBtn.addEventListener(`click`, createTask)

function saveTask() {
    localStorage.setItem(TASKNAME, JSON.stringify(tasks))
}

function saveGroup() {
    localStorage.setItem(GROUPNAME, JSON.stringify(groups))
}

function renderTaskDOM() {
    tasks.forEach(task => {
        task.createTaskDOM()
    })
}

tasksCard.addEventListener(`click`, setCompletedStatus)

completedCard.addEventListener(`click`, setCompletedStatus)

function setCompletedStatus(e) {
    if (e.target.classList.contains(`task-card--item__check`)) {
        const taskCardItem = e.target.parentElement
        taskCardItem.classList.toggle(`completed-task`)

        const selectedTaskID = +taskCardItem.dataset.id
        const selectedTask = tasks.find(task => selectedTaskID === task.id)

        selectedTask.setCompleteState()
        saveTask()

        moveToStatusState(taskCardItem)
        removeCompletedEmptyState()
        removeTaskEmptyState()

        updateChartCount()
    }
}

function moveToStatusState(task) {
    if (task.classList.contains(`completed-task`)) {
        task.remove()
        completedCard.insertAdjacentElement(`afterbegin`, task)
        return
    }
    task.remove()
    tasksCard.append(task)
}

function renderGroupDOM() {
    groups.forEach(group => {
        createGroupDOM(group)
    })

    updateChartCount()
}

createGroupBtn.addEventListener(`click`, createGroup)

function createGroup(e) {
    e.stopPropagation()

    if (createGroupInput.value === `` || null) {
        groupRequired.classList.add(`error`)
        groupRequired.textContent = `Group name is required!`

        return
    }

    createGroupDOM(createGroupInput.value)
    groups.push(createGroupInput.value)
    createSelectOption(createGroupInput.value)

    clearGroupForm()
    resetGroupRequiredStatus()

    saveGroup()

    removeGroupEmptyState()

    popOver.classList.add(`t`)
    popOver.classList.remove(`pop`)
}

function createGroupHTML(name) {
    const groupCardElement = document.importNode(groupTemplate.content, true)

    const groupName = groupCardElement.querySelector(`.groups-card--item__title > h4`)
    groupName.textContent = name

    const groupsCardItemDetail = groupCardElement.querySelector(`.groups-card--item__detail > p`)
    const groupsCardItemChartPercent = groupCardElement.querySelector(`.groups-card--item__chart > p`)
    const horizontalChartChild = groupCardElement.querySelector(`.horizontal-chart--main__child`)

    taskCompletedCount(name, groupsCardItemDetail)
    taskCompletedPercent(groupsCardItemChartPercent, horizontalChartChild)

    return groupCardElement
}

function taskCompletedPercent(percentageDetail, visualIndicator) {
    if (total === 0) {
        percentageDetail.textContent = `0%`
        visualIndicator.style.transform = `0%)`
        return
    }
    const percentage = Math.round((completedTask / total) * 100)
    percentageDetail.textContent = `${percentage}%`

    visualIndicator.style.transform = `translateX(${percentage}%)`
}

function createGroupDOM(groupName) {
    if (groupName === null) return
    groupsCard.insertBefore(createGroupHTML(groupName), groupsCard.firstChild)
}

function taskCompletedCount(groupName, completedCountDOM) {
    if (tasks.length === 0) return completedCountDOM.textContent = `Completed: 0/0`

    const filteredGroups = tasks.filter(task => task.group === groupName)

    total = filteredGroups.length

    function completedTaskNo() {
        if (filteredGroups.length > 0) {
            filteredGroups.forEach(filteredGroup => {
                completedTask = checkCompletedTask(filteredGroup.isComplete)
            })
            completedCount = 0
            return completedTask
        }
        return completedTask = 0
    }
    completedTaskNo()

    completedCountDOM.textContent = `Completed: ${completedTask}/${total}`
}

function checkCompletedTask(completedTask) {
    if (completedTask) return ++completedCount
    return completedCount
}

function createSelectOption(groupName) {
    let option = new Option(groupName, groupName)
    selectGroup.append(option)
}

function renderSelectOptionsDOM() {
    groups.forEach(group => {
        let newOption = new Option(group, group)
        selectGroup.append(newOption)
    })
}

renderSelectOptionsDOM()

progressCircle.style.strokeDasharray = circumference

function setProgress(percent) {
    progressCircle.style.strokeDashoffset = circumference - (percent / 100) * circumference
}

function updateChartCount() {
    updateChartCompleted()
    updateChartUncompleted()
    updateChartTotal()

    const percentComplete = document.querySelector(`.percent-complete`)

    const progressPercent = Math.round(updateChartCompleted() / updateChartTotal() * 100)

    percentComplete.textContent = `${progressPercent}%`

    setProgress(progressPercent)
}

function updateChartCompleted() {
    chartDescCompleted.textContent = taskCompletedStatus(true).length
    return chartDescCompleted.textContent
}

function updateChartUncompleted() {
    chartDescUncompleted.textContent = taskCompletedStatus(false).length
    return chartDescUncompleted.textContent
}

function updateChartTotal() {
    chartDescTotal.textContent = tasks.length
    return chartDescTotal.textContent
}