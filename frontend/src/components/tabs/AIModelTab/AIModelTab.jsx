import React, { useState, useEffect } from 'react';
import { Upload, Download, RefreshCw, BarChart3, Database, Clock } from 'lucide-react';
import aiModelService from '../../../services/aiModelService';

const AIModelTab = () => {
  const [trainingHistory, setTrainingHistory] = useState([]);

  useEffect(() => {
    loadTrainingHistory();
  }, []);

  const loadTrainingHistory = async () => {
    try {
      const history = await aiModelService.getTrainingHistory();
      setTrainingHistory(history);
    } catch (error) {
      console.error('Error loading training history:', error);
    }
  };

  const handleStartTraining = async () => {
    try {
      await aiModelService.startTraining("Nouveau dataset");
      await loadTrainingHistory(); // Recharger l'historique
    } catch (error) {
      console.error('Error starting training:', error);
    }
  };

  const handleExportData = async () => {
    try {
      await aiModelService.exportModelData();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Modèle de Deep Learning</h2>
        <p className="text-gray-600">Gestion et performance du modèle IA de détection</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-blue-600 bg-blue-100 rounded-md">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Précision</dt>
                  <dd className="text-lg font-medium text-gray-900">98.7%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-green-600 bg-green-100 rounded-md">
                  <Database className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taille dataset</dt>
                  <dd className="text-lg font-medium text-gray-900">12.5k images</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-purple-600 bg-purple-100 rounded-md">
                  <RefreshCw className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Détections/jour</dt>
                  <dd className="text-lg font-medium text-gray-900">245</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 text-yellow-600 bg-yellow-100 rounded-md">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 w-0 ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Temps traitement</dt>
                  <dd className="text-lg font-medium text-gray-900">0.8s</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Historique d'entraînement</h3>
          <div className="mt-4">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Version</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Précision</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Perte</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Dataset</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainingHistory.map((training, index) => (
                    <tr key={index}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {training.trainingDate}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.version}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.accuracy}%</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.loss}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{training.dataset}</td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Télécharger<span className="sr-only">, {training.version}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actions du modèle</h3>
          <div className="flex mt-4 space-x-4">
            <button 
              onClick={handleStartTraining}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nouvel entraînement
            </button>
            <button 
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModelTab;