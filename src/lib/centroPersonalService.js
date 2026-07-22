import { supabase } from "./supabaseClient";

// Centro de Mando Personal — todas las lecturas/escrituras van por RPCs en
// public (SECURITY DEFINER + candado is_admin). El SPA nunca toca el esquema
// centro_personal directamente, así no hay que exponerlo en la API de Supabase.

const rpc = async (fn, args) => {
    if (!supabase) throw new Error("Supabase no configurado");
    const { data, error } = await supabase.rpc(fn, args);
    if (error) throw error;
    return data;
};

export const getDashboard = () => rpc("cp_dashboard");

export const listProjects = () => rpc("cp_listar_proyectos");

export const listTasks = ({ proyecto = null, estado = null, incluirCerradas = false } = {}) =>
    rpc("cp_listar_tareas", {
        p_proyecto: proyecto,
        p_estado: estado,
        p_incluir_cerradas: incluirCerradas
    });

export const createTask = ({
    titulo,
    proyectoId = null,
    descripcion = null,
    prioridad = "normal",
    fechaLimite = null,
    estado = "por_hacer",
    etiquetas = [],
    origen = "manual"
}) =>
    rpc("cp_crear_tarea", {
        p_titulo: titulo,
        p_proyecto_id: proyectoId,
        p_descripcion: descripcion,
        p_prioridad: prioridad,
        p_fecha_limite: fechaLimite,
        p_estado: estado,
        p_etiquetas: etiquetas,
        p_origen: origen
    });

export const changeStatus = (id, estado) =>
    rpc("cp_cambiar_estado", { p_tarea_id: id, p_estado: estado });

export const updateTask = (id, patch) =>
    rpc("cp_actualizar_tarea", { p_tarea_id: id, p_patch: patch });

export const deleteTask = (id, motivo = null) =>
    rpc("cp_borrar_tarea", { p_tarea_id: id, p_motivo: motivo });
