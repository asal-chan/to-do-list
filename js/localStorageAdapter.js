class LocalStorageAdapter {
    constructor(storageKey) {
      this.storageKey = storageKey;
    }
  
    getTasks() {
      const tasks = localStorage.getItem(this.storageKey);
      return tasks ? JSON.parse(tasks) : [];
    }
  
    saveTasks(tasks) {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
  
    addTask(task) {
      const tasks = this.getTasks();
      tasks.push(task);
      this.saveTasks(tasks);
    }
  
    updateTask(updatedTask) {
      const tasks = this.getTasks();
      const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
      if (taskIndex > -1) {
        tasks[taskIndex] = updatedTask;
        this.saveTasks(tasks);
      }
    }

    deleteTask(deleteTaskid) {
      const tasks = this.getTasks();
      const taskIndex = tasks.findIndex(task => {
        return String(task.id) === String(deleteTaskid); 
      });
    
      
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1); 
        this.saveTasks(tasks); 
      } 
    }

  }
