class API {

    // ==========================
    // GET
    // ==========================

    static async get(url) {

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error("Error " + response.status);

        }

        return await response.json();

    }

    // ==========================
    // POST
    // ==========================

    static async post(url, data) {

        const response = await fetch(url, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        if (!response.ok) {

            throw new Error("Error " + response.status);

        }

        return await response.json();

    }

    // ==========================
    // PUT
    // ==========================

    static async put(url, data) {

        const response = await fetch(url, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        if (!response.ok) {

            throw new Error("Error " + response.status);

        }

        return await response.json();

    }

    // ==========================
    // DELETE
    // ==========================

    static async delete(url) {

        const response = await fetch(url, {

            method: "DELETE"

        });

        if (!response.ok) {

            throw new Error("Error " + response.status);

        }

        return await response.json();

    }

}