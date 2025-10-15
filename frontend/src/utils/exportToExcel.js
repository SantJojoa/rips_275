// src/utils/exportToExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiFetch } from "../lib/api";

export const exportFacturaToExcel = async (data) => {
    if (!data) {
        alert("No hay datos para exportar");
        return;
    }

    try {
        const workbook = XLSX.utils.book_new();

        const createSheetFromArray = (name, arr) => {
            if (!arr || arr.length === 0) return false;
            const rows = arr.map(item => {
                const plain = { ...item, ...(item.data || {}) };
                delete plain.data;
                return plain;
            });
            const ws = XLSX.utils.json_to_sheet(rows);
            XLSX.utils.book_append_sheet(workbook, ws, name.slice(0, 31));
            return true;
        };

        // Info general
        const info = [{
            Numero_factura: data.transaccion?.num_factura || "",
            NIT: data.transaccion?.num_nit || "",
            Prestador: data.control?.Prestador?.nombre_prestador || "",
            Periodo: `${data.control?.periodo_fac || ""}/${data.control?.año || ""}`,
            Estado: data.control?.status || "",
            Total_Usuarios: data.users?.length ?? 1
        }];
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(info), "Factura");

        // Misma lógica que tenías:
        const globalHasData = (arr) => Array.isArray(arr) && arr.length > 0;
        const anyGlobalData = [
            "consultas",
            "procedimientos",
            "medicamentos",
            "hospitalizaciones",
            "urgencias",
            "otrosServicios"
        ].some(k => globalHasData(data[k]));

        let perUserResults = [];

        if (!data.users || data.users.length === 0) {
            createSheetFromArray("Consultas", data.consultas);
            createSheetFromArray("Procedimientos", data.procedimientos);
            createSheetFromArray("Medicamentos", data.medicamentos);
            createSheetFromArray("Hospitalizaciones", data.hospitalizaciones);
            createSheetFromArray("Urgencias", data.urgencias);
            createSheetFromArray("OtrosServicios", data.otrosServicios);
        } else {
            if (!anyGlobalData) {
                const promises = data.users.map(async (user) => {
                    const numFactura = encodeURIComponent(String(data.transaccion?.num_factura || ""));
                    const url = `/api/auth/search/factura?num_factura=${numFactura}&user_id=${encodeURIComponent(String(user.id))}`;
                    const resp = await apiFetch(url);
                    const json = await resp.json();
                    if (!resp.ok) {
                        return { user, result: null, error: json?.message || `Error usuario ${user.id}` };
                    }
                    return { user, result: json, error: null };
                });

                perUserResults = await Promise.all(promises);
            } else {
                perUserResults = data.users.map(user => {
                    const filterByUser = (arr) => (arr || []).filter(item => {
                        const uid = item.user_id ?? item.id_user ?? item.usuario_id ?? item.userId ?? item.usuario?.id;
                        return String(uid) === String(user.id);
                    });

                    const result = {
                        consultas: filterByUser(data.consultas),
                        procedimientos: filterByUser(data.procedimientos),
                        medicamentos: filterByUser(data.medicamentos),
                        hospitalizaciones: filterByUser(data.hospitalizaciones),
                        urgencias: filterByUser(data.urgencias),
                        otrosServicios: filterByUser(data.otrosServicios),
                    };
                    return { user, result, error: null };
                });
            }

            for (const entry of perUserResults) {
                const user = entry.user;
                const res = entry.result;
                const sheetBase = `${user.tipo_doc || ""}-${user.num_doc || user.id || "user"}`
                    .replace(/[\\/?*[\]]/g, "_")
                    .slice(0, 20);

                if (!res) {
                    const infoUser = [{
                        Tipo_Doc: user.tipo_doc || "",
                        Numero_Doc: user.num_doc || user.id || "",
                        Tipo_Usuario: user.tipo_usuario || "",
                        Nota: entry.error || "Sin datos de servicios para este usuario"
                    }];
                    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(infoUser), `${sheetBase}_Info`.slice(0, 31));
                    continue;
                }

                createSheetFromArray(`${sheetBase}_Consultas`, res.consultas);
                createSheetFromArray(`${sheetBase}_Procedimientos`, res.procedimientos);
                createSheetFromArray(`${sheetBase}_Medicamentos`, res.medicamentos);
                createSheetFromArray(`${sheetBase}_Hospitalizaciones`, res.hospitalizaciones);
                createSheetFromArray(`${sheetBase}_Urgencias`, res.urgencias);
                createSheetFromArray(`${sheetBase}_OtrosServicios`, res.otrosServicios);

                const infoUser = [{
                    Tipo_Doc: user.tipo_doc || "",
                    Numero_Doc: user.num_doc || user.id || "",
                    Tipo_Usuario: user.tipo_usuario || "",
                    Factura: data.transaccion?.num_factura || "",
                    NIT: data.transaccion?.num_nit || "",
                }];
                XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(infoUser), `${sheetBase}_Info`.slice(0, 31));
            }
        }

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const fileName = `Factura_${data.transaccion?.num_factura || "Sin_numero"}.xlsx`;
        saveAs(blob, fileName);
    } catch (err) {
        console.error("Error exportando a excel:", err);
        alert("Ocurrió un error exportando el Excel. Revisa la consola.");
    }
};
