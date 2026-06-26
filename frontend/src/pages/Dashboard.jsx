import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin } from '../lib/auth';
import { Search, Upload, UserPlus, List, Database, ArrowLeftRight, FileStack } from "lucide-react";

const MODULE_ICONS = {
    Database: { bg: '#EDF3EC', color: '#346538' },
    ArrowLeftRight: { bg: '#E1F3FE', color: '#1F6C9F' },
    Search: { bg: '#E1F3FE', color: '#1F6C9F' },
    Upload: { bg: '#EDF3EC', color: '#346538' },
    List: { bg: '#FDEBEC', color: '#9F2F2D' },
    UserPlus: { bg: '#FBF3DB', color: '#956400' },
    FileStack: { bg: '#F3EEFE', color: '#7C3AED' },
};

function ModuleCard({ title, description, icon: Icon, action, iconName }) {
    const palette = MODULE_ICONS[iconName] || { bg: '#F7F6F3', color: '#787774' };

    return (
        <button
            onClick={action}
            style={{
                border: '1px solid #EAEAEA',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                transition: 'box-shadow 200ms, transform 150ms',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            className="group text-left flex flex-col gap-3 p-5 w-full cursor-pointer"
        >
            <div
                style={{
                    width: '36px', height: '36px',
                    borderRadius: '8px',
                    backgroundColor: palette.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <Icon style={{ color: palette.color }} className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-[#111111]">{title}</h3>
                <p className="mt-0.5 text-xs text-[#787774] leading-relaxed">{description}</p>
            </div>
        </button>
    );
}

function Section({ title, icon: Icon, iconName, children }) {
    const palette = MODULE_ICONS[iconName] || { color: '#787774' };
    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: '8px', backgroundColor: '#F9F9F8' }}
            className="p-5">
            <div className="flex items-center gap-2 mb-4">
                <Icon style={{ color: palette.color }} className="w-4 h-4" strokeWidth={1.5} />
                <h2 className="text-sm font-semibold text-[#111111]">{title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();

    const displayName = user?.nombres?.trim() ? user.nombres : user?.username;

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-[#111111] tracking-tight">
                    Bienvenido, <span style={{ color: '#462882' }}>{displayName}</span>
                </h1>
                <p className="mt-1 text-sm text-[#787774]">
                    Panel de control del Sistema FEV-RIPS
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {admin && (
                    <Section title="Conexion Ministerio" icon={Database} iconName="Database">
                        <ModuleCard
                            title="Consultar CUV"
                            description="Consulta el CUV en la base de datos del Ministerio de Salud."
                            icon={Database}
                            iconName="Database"
                            action={() => navigate('/consultar-cuv')}
                        />
                        <ModuleCard
                            title="Comparar CUV y XML"
                            description="Compara el Total Valor Servicios del CUV con el PayableAmount del XML."
                            icon={ArrowLeftRight}
                            iconName="ArrowLeftRight"
                            action={() => navigate('/comparar-cuv-xml')}
                        />
                    </Section>
                )}

                <Section
                    title={admin ? 'Subir Informacion' : 'Consultar Informacion'}
                    icon={admin ? Upload : Search}
                    iconName={admin ? 'Upload' : 'Search'}
                >
                    <ModuleCard
                        title="Consultar registros"
                        description="Busca y revisa registros existentes."
                        icon={Search}
                        iconName="Search"
                        action={() => navigate('/consultar')}
                    />
                    {admin && (
                        <ModuleCard
                            title="Subir JSON"
                            description="Carga archivos RIPS en formato JSON."
                            icon={Upload}
                            iconName="Upload"
                            action={() => navigate('/upload-json')}
                        />
                    )}
                    {!admin && (
                        <ModuleCard
                            title="Cargar Factura"
                            description="Sube CUV, RIP y XML y valida que correspondan a la misma factura."
                            icon={FileStack}
                            iconName="FileStack"
                            action={() => navigate('/cargar-factura')}
                        />
                    )}
                </Section>

                {admin && (
                    <div className="md:col-span-2">
                        <Section title="Administrar" icon={UserPlus} iconName="UserPlus">
                            <ModuleCard
                                title="Gestionar facturas"
                                description="Listar y gestionar facturas del sistema."
                                icon={List}
                                iconName="List"
                                action={() => navigate('/gestionar-facturas')}
                            />
                            <ModuleCard
                                title="Crear Usuario"
                                description="Crea nuevos usuarios para el sistema."
                                icon={UserPlus}
                                iconName="UserPlus"
                                action={() => navigate('/crear-usuario')}
                            />
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
}
