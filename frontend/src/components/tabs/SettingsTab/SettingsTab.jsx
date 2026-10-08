import React from 'react';
import userService from '../../../services/userService';

const SettingsTab = ({ user }) => {
  const handleSaveSettings = async (settings) => {
    try {
      await userService.updateNotificationSettings(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres du Système</h2>
        <p className="text-gray-600">Configuration de l'application</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Paramètres de détection</h3>
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="detection-sensitivity" className="block text-sm font-medium text-gray-700">
                  Sensibilité de détection
                </label>
                <select
                  name="detection-sensitivity"
                  id="detection-sensitivity"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="medium"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>

              <div>
                <label htmlFor="scan-frequency" className="block text-sm font-medium text-gray-700">
                  Fréquence des analyses
                </label>
                <select
                  name="scan-frequency"
                  id="scan-frequency"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="realtime"
                >
                  <option value="realtime">Temps réel</option>
                  <option value="5">5 secondes</option>
                  <option value="10">10 secondes</option>
                  <option value="30">30 secondes</option>
                </select>
              </div>

              <div>
                <label htmlFor="alert-threshold" className="block text-sm font-medium text-gray-700">
                  Seuil d'alerte (écarts)
                </label>
                <input
                  type="number"
                  name="alert-threshold"
                  id="alert-threshold"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="5"
                />
              </div>

              <div>
                <label htmlFor="data-retention" className="block text-sm font-medium text-gray-700">
                  Rétention des données (jours)
                </label>
                <input
                  type="number"
                  name="data-retention"
                  id="data-retention"
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  defaultValue="90"
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer les paramètres
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Paramètres de notification</h3>
          <div className="mt-4">
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">Types de notifications</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="bigbag-missing"
                      name="bigbag-missing"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="bigbag-missing" className="font-medium text-gray-700">
                      BigBags manquants
                    </label>
                    <p className="text-gray-500">Alertes lorsque des écarts sont détectés entre l'inventaire et les mouvements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="system-errors"
                      name="system-errors"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="system-errors" className="font-medium text-gray-700">
                      Erreurs système
                    </label>
                    <p className="text-gray-500">Alertes pour les problèmes techniques du système de détection.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="daily-reports"
                      name="daily-reports"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="daily-reports" className="font-medium text-gray-700">
                      Rapports quotidiens
                    </label>
                    <p className="text-gray-500">Résumé quotidien des mouvements et de l'état du stock.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer les préférences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;