import React, { useEffect, useState } from 'react';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            demo: [],
			contacts: [] 
        },
        actions: {
            createAgenda: async () => {
				try {
					const response = await fetch('https://playground.4geeks.com/contact/agendas/mateo1627', {
						method: "POST",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							// Añade los datos necesarios para crear la agenda
						})
					});
					if (!response.ok) {
						throw new Error('Failed to create agenda');
					}
				} catch (error) {
					console.error('Error creating agenda:', error);
				}
			},
			addContact: async (name, phone, email, address) => {
				const store = getStore()
				try {
					const response = await fetch('https://playground.4geeks.com/contact/agendas/mateo1627/contacts', {
						method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: name,
							phone: phone,
							email: email,
							address: address
						})
					});

					if (!response.ok) {
						throw new Error('algo pasa chaval');
					}

					const data = await response.json();
					console.log("Nuevo contacto agregado:", data);
		
					console.log(data);
					setStore({ contacts: [...store.contacts, data] });
					return true
				} catch (error) {
					console.error("Error al agregar contacto:", error);
				}
			},
			//setStore({contacts: store.contacts.filter(element=> element.id !== idContact)})
			deleteContact: async (idContact) => {
				const store = getStore()
				fetch(`https://playground.4geeks.com/contact/agendas/mateo1627/contacts/${idContact}`, {

					method: "DELETE",
					headers: {
						'Accept': 'application/json'
					},
				})
					.then((response) => {
						if (response.ok) {
							setStore(
								{
									contacts: store.contacts.filter(contact => contact.id !== idContact)
								});
						}
					})
					.catch((error) => {
						console.log(error);
					});
			},
			getContact: async () => {
				const actions = getActions();

				const fetchContacts = async () => {
					try {
						const response = await fetch('https://playground.4geeks.com/contact/agendas/mateo1627/contacts');
						if (response.status === 404) {
							await actions.createAgenda(); // Llama a createAgenda si el estado es 404
							// Intenta obtener los contactos nuevamente después de crear la agenda
							await fetchContacts();
							return; // Sal de la función original después de reintentar
						}
						const data = await response.json();
						setStore({ contacts: data.contacts });
					} catch (error) {
						console.error("Error al cargar los contactos:", error);
					}
				};

				await fetchContacts(); // Llama a la función de obtener contactos
			},
			updateContact: async (idContact, name, phone, email, address) => {
				const store = getStore();

				try {
					const response = await fetch(`https://playground.4geeks.com/contact/agendas/mateo1627/contacts/${idContact}`, {
						method: "PUT",
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							name: name,
							phone: phone,
							email: email,
							address: address
						})
					});

					if (response.ok) {
						const updatedContact = await response.json();
						setStore({
							contacts: store.contacts.map(contact =>
								contact.id == idContact ? updatedContact : contact
							)
						});
					} else {
						console.error('Failed to update contact:', await response.text());
					}
				} catch (error) {
					console.error('Error updating contact:', error);
				}
			}
		}

	}
}

export default getState;
