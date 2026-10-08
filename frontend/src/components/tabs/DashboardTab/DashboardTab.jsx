import React from 'react';
import { BarChart3 ,AlertCircle ,Package , Download, Upload, CheckCircle, StopCircle, Camera, Database } from 'lucide-react';
import StatCard from '../../common/StatCard/StatCard';

const DashboardTab = ({ stats, movements }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord - Port de Toamasina</h2>
        <p className="text-gray-600">Surveillance en temps réel des mouvements de BigBags</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total BigBags" value={stats.totalBigBags} icon={Package} color="blue" />
        <StatCard title="Entrées aujourd'hui" value={stats.entreesAujourdhui} icon={Download} color="green" />
        <StatCard title="Sorties aujourd'hui" value={stats.sortiesAujourdhui} icon={Upload} color="red" />
        <StatCard title="BigBags manquants" value={stats.bigbagsManquants} icon={AlertCircle} color="yellow" />
        <StatCard title="BigBags endommagés" value={stats.bigbagsEndommages} icon={AlertCircle} color="orange" />
        <StatCard title="Précision détection" value={`${stats.precisionDetection}%`} icon={BarChart3} color="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Derniers mouvements */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Derniers mouvements</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {movements.slice(0, 5).map(mouvement => (
                <div key={mouvement.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-md ${
                        mouvement.type === 'entrée' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {mouvement.type === 'entrée' ? <Download className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{mouvement.camion}</h4>
                      <p className="text-sm text-gray-500">
                        {mouvement.type === 'entrée' ? mouvement.fournisseur : mouvement.client} • {mouvement.chauffeur}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          mouvement.type === 'entrée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {mouvement.type === 'entrée' ? 'Entrée' : 'Sortie'}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {mouvement.bigbags} BigBags
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="text-xs text-gray-500">
                        {new Date(mouvement.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 text-right bg-gray-50">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir tous les mouvements
              </button>
            </div>
          </div>
        </div>

        {/* État des caméras */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">État du système</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between p-4 mb-4 rounded-lg bg-green-50">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="ml-2 text-sm font-medium text-green-800">Système de détection actif</span>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                  <StopCircle className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Caméra Entrée</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Caméra Sortie</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-gray-600" />
                    <span className="ml-2 text-sm font-medium text-gray-800">Modèle IA</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    Opérationnel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;