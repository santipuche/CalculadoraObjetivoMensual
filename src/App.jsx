import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, DollarSign, Calendar, Moon, Sun, Plus, Trash2, Edit2, RefreshCw } from 'lucide-react';
import './App.css';

const SalesDashboard = () => {
  const getDayAR = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' })).getDate();
  const getMonthYearAR = () => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
    const m = d.toLocaleDateString('es-AR', { month: 'long', timeZone: 'America/Argentina/Buenos_Aires' });
    return `${m.charAt(0).toUpperCase() + m.slice(1)} ${d.getFullYear()}`;
  };

  const initData = () => {
    const s = localStorage.getItem('salesData');
    return s ? JSON.parse(s) : Array.from({ length: 31 }, (_, i) => ({ dia: i + 1, ingreso: 0 }));
  };
  const initObj = () => {
    const s = localStorage.getItem('objetivo');
    return s ? parseInt(s) : 0;
  };

  const [dark, setDark] = useState(false);
  const [day, setDay] = useState(getDayAR());
  const [monthYear, setMonthYear] = useState(getMonthYearAR());
  const [data, setData] = useState(initData());
  const [obj, setObj] = useState(initObj());
  const [tempObj, setTempObj] = useState('');
  const [newD, setNewD] = useState(getDayAR().toString());
  const [newI, setNewI] = useState('');
  const [editing, setEditing] = useState(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => { localStorage.setItem('salesData', JSON.stringify(data)); }, [data]);
  useEffect(() => { localStorage.setItem('objetivo', obj.toString()); }, [obj]);
  useEffect(() => {
    const int = setInterval(() => {
      const nd = getDayAR();
      setDay(nd);
      setMonthYear(getMonthYearAR());
      if (!newI) setNewD(nd.toString());
    }, 60000);
    return () => clearInterval(int);
  }, [newI]);

  const total = data.reduce((sum, i) => sum + i.ingreso, 0);
  const activos = data.filter(i => i.ingreso > 0).length;
  const cumpl = Math.round((total / obj) * 100);
  const lastDay = Math.max(...data.filter(i => i.ingreso > 0).map(i => i.dia), 0);
  const diaCalc = lastDay > 0 ? lastDay : day;
  const rest = 31 - diaCalc;
  const falta = obj - total;
  const promNec = rest > 0 ? Math.round(falta / rest) : 0;

  const handleAdd = () => {
    if (newD && newI) {
      const d = parseInt(newD);
      const ing = parseInt(newI.replace(/[^0-9]/g, ''));
      if (d >= 1 && d <= 31 && !isNaN(ing) && ing >= 0) {
        const idx = data.findIndex(i => i.dia === d);
        if (idx >= 0) {
          const up = [...data];
          up[idx] = { ...up[idx], ingreso: ing };
          setData(up.sort((a, b) => a.dia - b.dia));
        } else {
          setData([...data, { dia: d, ingreso: ing }].sort((a, b) => a.dia - b.dia));
        }
        setNewI('');
      }
    }
  };

  const handleDel = (d) => setData(data.filter(i => i.dia !== d));
  const handleUpd = (d, ing) => {
    setData(data.map(i => i.dia === d ? { ...i, ingreso: parseInt(ing) || 0 } : i));
    setEditing(null);
  };
  const handleRst = () => {
    setData(Array.from({ length: 31 }, (_, i) => ({ dia: i + 1, ingreso: 0 })));
    setObj(0);
    setTempObj('');
    localStorage.removeItem('salesData');
    localStorage.removeItem('objetivo');
    setShowReset(false);
  };

  const getCol = (s) => s === 'Mes bajo control' ? '#22c55e' : s === 'Mes en seguimiento' ? '#eab308' : '#ef4444';

  const ritmoGeneral = total >= obj ? 'Buen ritmo' : (cumpl >= 70 || (total / ((obj / 31) * diaCalc)) * 100 >= 90) ? 'Ajustable' : 'Necesita acción';
  const estadoGeneral = cumpl >= 100 ? 'Mes bajo control' : cumpl >= 70 ? 'Mes en seguimiento' : 'Mes complicado';

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-slate-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src="https://i.postimg.cc/Pvd8HHty/Gemini-Generated-Image-5pusps5pusps5pus-(2).png"
              alt="Logo"
              className="w-16 h-16 rounded-lg object-cover shadow-lg"
            />
            <div>
              <h1 className={`text-4xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'} mb-2`}>Calculadora de Objetivo Mensual</h1>
              <p className={dark ? 'text-slate-400' : 'text-slate-600'}>{monthYear} • Día {day} • Tiempo real</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowReset(true)} className={`p-3 rounded-lg ${dark ? 'bg-slate-800 hover:bg-slate-700 text-red-400' : 'bg-white hover:bg-slate-100 text-red-600 shadow-md'}`}>
              <RefreshCw className="w-6 h-6" />
            </button>
            <button onClick={() => setDark(!dark)} className={`p-3 rounded-lg ${dark ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'}`}>
              {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* OBJETIVO Y FALTANTE - LADO A LADO */}
        <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Target className={`w-8 h-8 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div style={{ flex: 1 }}>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Objetivo Mensual (ARS)</p>
                <input
                  type="text"
                  value={tempObj || (obj === 0 ? '' : obj.toLocaleString())}
                  onChange={(e) => setTempObj(e.target.value)}
                  onFocus={() => {
                    if (obj === 0) setTempObj('');
                    else if (!tempObj) setTempObj(obj.toString());
                  }}
                  onBlur={() => {
                    const n = parseInt(tempObj.replace(/[^0-9]/g, ''));
                    if (!isNaN(n) && n >= 0) setObj(n);
                    else if (tempObj === '') setObj(0);
                    setTempObj('');
                  }}
                  placeholder="Ingresa tu objetivo mensual"
                  className={`text-2xl font-bold w-full ${dark ? 'bg-slate-800 text-slate-100 placeholder-slate-600' : 'bg-white text-slate-800 placeholder-slate-400'}`}
                  style={{ border: 'none', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }} className={`${dark ? 'bg-slate-700/50' : 'bg-amber-50'} rounded-lg p-4 border-l-4 ${dark ? 'border-amber-500' : 'border-amber-600'}`}>
              <div style={{ flex: 1 }}>
                <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                  {total >= obj ? '¡Objetivo superado!' : 'Te faltan para cerrar el mes'}
                </p>
                <p className={`text-2xl font-bold ${total >= obj ? 'text-green-500' : dark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {total >= obj ? `+${(total - obj).toLocaleString()}` : `${(obj - total).toLocaleString()}`}
                </p>
              </div>
              <DollarSign className={`w-10 h-10 ${total >= obj ? 'text-green-500' : dark ? 'text-amber-400' : 'text-amber-600'} opacity-30`} />
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          <div>
            <div className={`w-full h-8 ${dark ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500"
                style={{
                  width: `${Math.min(cumpl, 100)}%`,
                  backgroundColor: cumpl >= 100 ? '#22c55e' : cumpl >= 50 ? '#eab308' : '#ef4444'
                }}
              >
                {cumpl > 10 && `${cumpl}%`}
              </div>
            </div>
            <p className={`text-center text-sm mt-2 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Llevás completado el <span className="font-bold">{cumpl}%</span> del mes
            </p>
          </div>
        </div>

        <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'} mb-4`}>Agregar/Editar Ingreso</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>Selecciona el Día</label>
              <select value={newD} onChange={(e) => setNewD(e.target.value)} className={`w-full px-4 py-2 border rounded-lg ${dark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-300'}`}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>Día {d} {d === day ? '(Hoy)' : ''}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'} block mb-1`}>Ingreso (ARS)</label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>$</span>
                <input type="text" value={newI} onChange={(e) => setNewI(e.target.value.replace(/[^0-9]/g, ''))} placeholder="50000" className={`w-full pl-8 pr-4 py-2 border rounded-lg ${dark ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300 placeholder-slate-400'}`} />
              </div>
            </div>
            <div className="flex items-end">
              <button onClick={handleAdd} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 h-[42px]">
                <Plus className="w-5 h-5" />Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${dark ? 'bg-slate-800 border-blue-600' : 'bg-white border-blue-600'} rounded-lg shadow-lg p-6 border-l-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Ingreso Total</p>
                <p className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>${total.toLocaleString()}</p>
              </div>
              <DollarSign className={`w-12 h-12 ${dark ? 'text-blue-500' : 'text-blue-600'} opacity-20`} />
            </div>
          </div>
          <div className={`${dark ? 'bg-slate-800 border-emerald-600' : 'bg-white border-emerald-600'} rounded-lg shadow-lg p-6 border-l-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Objetivo</p>
                <p className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>${obj.toLocaleString()}</p>
              </div>
              <Target className={`w-12 h-12 ${dark ? 'text-emerald-500' : 'text-emerald-600'} opacity-20`} />
            </div>
          </div>
          <div className={`${dark ? 'bg-slate-800 border-cyan-600' : 'bg-white border-cyan-600'} rounded-lg shadow-lg p-6 border-l-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Promedio Diario Necesario</p>
                <p className={`text-xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {total >= obj ? <span className="text-green-500">✓ Alcanzado</span> : rest > 0 ? `${promNec.toLocaleString()}/día` : <span className="text-red-500">Finalizado</span>}
                </p>
                {total < obj && rest > 0 && <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Quedan {rest} días • Falta ${falta.toLocaleString()}</p>}
              </div>
              <Calendar className={`w-12 h-12 ${dark ? 'text-cyan-500' : 'text-cyan-600'} opacity-20`} />
            </div>
          </div>
        </div>

        <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden mb-8`}>
          <div className={`p-6`}>
            <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Detalle de Ingresos</h3>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'} mt-1 mb-4`}>Mostrando {data.length} registros</p>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }} className={`${dark ? 'bg-slate-700/50' : 'bg-purple-50'} rounded-lg p-4 border-l-4 ${dark ? 'border-purple-500' : 'border-purple-600'}`}>
                <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Estado</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-4 py-2 text-base font-bold rounded-full text-white" style={{ backgroundColor: getCol(estadoGeneral) }}>
                    {estadoGeneral}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1 }} className={`${dark ? 'bg-slate-700/50' : 'bg-green-50'} rounded-lg p-4 border-l-4 ${dark ? 'border-green-500' : 'border-green-600'}`}>
                <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>Ritmo</p>
                <p className={`text-xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>{ritmoGeneral}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={dark ? 'bg-slate-900' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Día</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Ingreso</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Acumulado</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {data.map((i) => {
                  const acum = data.slice(0, i.dia).reduce((sum, item) => sum + item.ingreso, 0);
                  const acumShow = i.ingreso > 0 ? acum : 0;

                  return (
                    <tr key={i.dia} className={dark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}>
                      <td className={`px-6 py-4 text-sm font-medium ${dark ? 'text-slate-200' : 'text-slate-900'}`}>{i.dia}</td>
                      <td className={`px-6 py-4 text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {editing === i.dia ?
                          <input type="text" defaultValue={i.ingreso} onBlur={(e) => handleUpd(i.dia, e.target.value)} autoFocus className={`px-2 py-1 border rounded ${dark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-300'}`} />
                          : `$${i.ingreso.toLocaleString()}`
                        }
                      </td>
                      <td className={`px-6 py-4 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-slate-900'}`}>${acumShow.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(i.dia)} className={`p-1 rounded ${dark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDel(i.dia)} className={`p-1 rounded ${dark ? 'hover:bg-slate-600' : 'hover:bg-slate-200'}`}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'} mb-4`}>Progreso vs Objetivo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.map((i, idx) => ({ dia: i.dia, acum: data.slice(0, idx + 1).reduce((s, x) => s + x.ingreso, 0) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="dia" stroke={dark ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={dark ? '#94a3b8' : '#64748b'} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: dark ? '#1e293b' : '#fff', borderRadius: '0.5rem' }} />
                <Legend />
                <Line type="monotone" dataKey="acum" stroke="#3b82f6" strokeWidth={2} name="Acumulado" />
                <Line type="monotone" dataKey={() => obj} stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Objetivo" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'} mb-4`}>Ingresos Diarios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#475569' : '#e2e8f0'} />
                <XAxis dataKey="dia" stroke={dark ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={dark ? '#94a3b8' : '#64748b'} />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: dark ? '#1e293b' : '#fff', borderRadius: '0.5rem' }} />
                <Legend />
                <Bar dataKey="ingreso" fill="#6366f1" name="Ingreso" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'} mb-4`}>Progresión Gráfica</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Ingreso Total', value: total },
                    { name: 'Falta para Objetivo', value: obj > total ? obj - total : 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(e) => `${e.name}: $${e.value.toLocaleString()}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  formatter={(v) => `$${v.toLocaleString()}`}
                  contentStyle={{ backgroundColor: dark ? '#1e293b' : '#fff', borderRadius: '0.5rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`rounded-lg shadow-lg p-6 text-white ${dark ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-blue-900 to-slate-800'}`}>
          <h3 className="text-xl font-bold mb-4">Resumen del Mes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-blue-100'}`}>Días con Ingreso</p>
              <p className="text-3xl font-bold">{activos} de 31</p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-blue-100'}`}>Diferencia</p>
              <p className="text-3xl font-bold">{total >= obj ? '+' : ''}${(total - obj).toLocaleString()}</p>
            </div>
            <div>
              <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-blue-100'}`}>Estado</p>
              <p className="text-3xl font-bold">{total >= obj ? '✅ Superado' : '⏳ En Progreso'}</p>
            </div>
          </div>
        </div>

        {showReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${dark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-2xl max-w-md w-full p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full"><RefreshCw className="w-6 h-6 text-red-600" /></div>
                <h3 className={`text-xl font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>¿Reiniciar valores?</h3>
              </div>
              <p className={`mb-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>Esto establecerá todos los ingresos y el objetivo en $0. No se puede deshacer.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowReset(false)} className={`px-4 py-2 rounded-lg font-medium ${dark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>Cancelar</button>
                <button onClick={handleRst} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium">Sí, reiniciar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
