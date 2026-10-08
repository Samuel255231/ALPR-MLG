import React from 'react';
import { Camera, Play } from 'lucide-react';

const SurveillanceTab = ({ cameras }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Surveillance en Temps Réel</h2>
        <p className="text-gray-600">Monitoring des caméras de détection</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cameras.map(camera => (
          <div key={camera.id} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${
                    camera.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{camera.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{camera.location}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  camera.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {camera.status === 'active' ? 'Active' : 'Maintenance'}
                </span>
                <span className="text-gray-600">{camera.detectionCount} détections</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Flux vidéo en direct</h3>
          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Caméra Entrée Principale</p>
                <button className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-1" />
                  Activer
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center h-64 bg-gray-200 rounded-lg">
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Caméra Sortie Principale</p>
                <button className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-1" />
                  Activer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveillanceTab;