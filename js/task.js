const tasksCard = document.querySelector(".tasks-card")
const completedCard = document.querySelector(".completed-card")
const taskTemplate = document.querySelector(`#task-template`)

export class Task {
    constructor(name, group, isComplete, id) {
        this.name = name
        this.group = this.groupName(group)
        this.isComplete = isComplete
        this.id = id
    }

    setCompleteState() {
        return this.isComplete = this.isComplete === false
    }

    createTask() {
        const taskCardElement = document.importNode(taskTemplate.content, true)

        const pTag = taskCardElement.querySelector(`.task-card--item__task > p`)
        pTag.textContent = this.name

        const taskCardItem = taskCardElement.querySelector(`.task-card--item`)
        taskCardItem.dataset.id = this.id

        if (this.isComplete) {
            taskCardItem.classList.add(`completed-task`)
            completedCard.insertAdjacentElement(`afterbegin`, taskCardItem)
        }

        return taskCardElement
    }

    createTaskDOM() {
        tasksCard.append(this.createTask())
    }

    groupName(groupName) {
        if (groupName === "") return this.group = null

        return this.group = groupName
    }
}