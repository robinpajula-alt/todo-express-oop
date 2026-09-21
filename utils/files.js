import fs from "node:fs/promises";

class FileManager{
    async writeFile(filename, data){
        try{
        data = JSON.stringify(data, null, 2)
        await fs.writeFile(filename, data)
        } catch(err){
            console.log("write error => ", err)
        }
    } 

    async readFile(filename){
        try{
            const fileContent = await fs.readFile(filename, "utf-8")
            const fileData = JSON.parse(fileContent)
            return fileData
        }
        catch(error){
            console.error("read error => ", error)
            return null
        }
    }

    async updateTodo(filename, id, updatedTask) {
        const todos = await this.readFile(filename) || [];
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) return null;

        todos[index].task = updatedTask;
        await this.writeFile(filename, todos);
        return todos[index];
    }

    async deleteTodo(filename, id) {
        const todos = await this.readFile(filename) || [];
        const index = todos.findIndex(todo => todo.id === id);

        if (index === -1) return false;

        const updatedTodos = todos.filter(todo => todo.id !== id);
        await this.writeFile(filename, updatedTodos);
        return true;
    }
} 

export const fileManager = new FileManager()