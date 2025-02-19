const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			plans: [],
			userProfile: {},
			showedPlan: {},
			planAddress: ""
		},
		actions: {

			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
					const data = await resp.json();
					setStore({ message: data.message });

					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
				}
			},
			changeColor: (index, color) => {
				const store = getStore();
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});
				setStore({ demo: demo });
			},

			signup: async (name, email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/register", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password, name }),
					});
					if (!resp.ok) throw new Error("Error en el registro");

					const data = await resp.json();
					console.log("Usuario registrado:", data);
					localStorage.setItem("token", data.token);
					setStore({ token: data.token });
				} catch (error) {
					console.error("Error en el registro:", error);
					throw error;
				}
			},
			login: async (email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/login", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password }),
					});
					if (!resp.ok) throw new Error("Login fallido");

					const data = await resp.json();
					localStorage.setItem("token", data.token);
					setStore({ token: data.token });
				} catch (error) {
					console.error("Error en el login:", error);
					throw error;
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				setStore({ token: null });
			},

			private: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) return false;

					const resp = await fetch(process.env.BACKEND_URL + "/private", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						},
					});
					if (!resp.ok) return false;

					const data = await resp.json();
					return true;
				} catch (error) {
					console.error("Error validando token:", error);
					return false;
				}
			},

			getPlans: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/plans", {
						method: "GET",
						headers: { "Content-Type": "application/json" }
					});
					
					const data = await resp.json();
					setStore({ plans: data });
					const store = getStore();
					console.log("planes")
					console.log(store.plans)
					
				} catch (error) {
					console.error("Error trayendo planes:", error);
					return false;
				}
			},			

			getCategories: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/categories", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (!resp.ok) {
						throw new Error(`Error ${resp.status}: ${resp.statusText}`);
					}

					const data = await resp.json();
					setStore({ categories: data });
				} catch (error) {
					console.error("Error al obtener categorías:", error);
				}
			},

			createPlan: async (planData) => {
				try {
					const token = localStorage.getItem("token");
					if (!token) throw new Error("No hay token de autenticación");

					const resp = await fetch(process.env.BACKEND_URL + "/plans", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						},
						body: JSON.stringify(planData),
					});
					if (!resp.ok) throw new Error("Error al crear el plan");

					const data = await resp.json();
					console.log("Plan creado:", data);
					return data;
				} catch (error) {
					console.error("Error al crear el plan:", error);
					throw error;
				}
			},

			deleteUser: async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) throw new Error("No hay token de autenticación");

					const isValidToken = await getActions().private();
					if (!isValidToken) {
						throw new Error("Token no válido o expirado");
					}

					const resp = await fetch(process.env.BACKEND_URL + "/user/profile", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						},
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.message || "Error al eliminar el usuario");
					}

					const data = await resp.json();
					console.log("Usuario eliminado:", data);
					localStorage.removeItem("token");
					setStore({ token: null, user: null });
					return data;
				} catch (error) {
					console.error("Error al eliminar el usuario:", error);
					throw error;
				}
			},

			saveProfile: async (profileData) => {
				try {
					const token = localStorage.getItem("token");
					if (!token) throw new Error("No hay token de autenticación");

					const resp = await fetch(process.env.BACKEND_URL + "/user/profile", {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						},
						body: JSON.stringify(profileData),
					});
					if (!resp.ok) throw new Error("Error al actualizar el perfil");
					const data = await resp.json();
					console.log("Perfil actualizado:", data);
					const store = getStore();
					setStore({ userProfile: data });
					localStorage.setItem("userProfile", JSON.stringify(data));

					return data;
				} catch (error) {
					console.error("Error al actualizar el perfil:", error);
					throw error;
				}
			},

			joinPlan: async(planId) => {
				try {
					const token = localStorage.getItem("token");
					if (!token) throw new Error("No hay token de autenticación");

					const resp = await fetch(process.env.BACKEND_URL + `/plans/${planId}/join`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						}
					});
					const data = await resp.json();

					if (!resp.ok) throw new Error(data.msg || "Error al unirse al plan");
			
					return data;
				} catch (error) {
					console.error("Error al unirse al plan:", error);
					throw error;
				}

			},

			setShowedPlan: (plan) => {
				setStore({showedPlan: plan})
			},
			setPlanAddress: (address) => {
				setStore({planAddress: address})
			}

		}
	};
};

export default getState;

