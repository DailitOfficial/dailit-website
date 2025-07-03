'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestFormPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (test: string, success: boolean, message: string, data?: any) => {
    const result = {
      test,
      success,
      message,
      data: data || null,
      timestamp: new Date().toISOString()
    }
    setTestResults(prev => [...prev, result])
    console.log('Test Result:', result)
  }

  const runDiagnostics = async () => {
    setIsLoading(true)
    setTestResults([])

    try {
      // Test 1: Check environment variables
      addResult(
        'Environment Variables', 
        !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        `URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}, Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}`
      )

      // Test 2: Check Supabase connection
      try {
        const { data, error } = await supabase.from('leads').select('count').limit(1)
        addResult('Supabase Connection', !error, error ? error.message : 'Connection successful', data)
      } catch (err: any) {
        addResult('Supabase Connection', false, err.message || 'Connection failed')
      }

      // Test 3: Check if leads table exists
      try {
        const { data, error } = await supabase.from('leads').select('*').limit(1)
        addResult('Leads Table Exists', !error, error ? error.message : 'Table exists and is accessible', data)
      } catch (err: any) {
        addResult('Leads Table Exists', false, err.message || 'Table access failed')
      }

      // Test 4: Test actual form submission
      try {
        const testLead = {
          business_name: 'Test Company ' + Date.now(),
          full_name: 'Test User',
          email: 'test+' + Date.now() + '@example.com',
          industry: 'technology',
          number_of_users: '1-10',
          source: 'diagnostic_test'
        }

        const { data, error } = await supabase
          .from('leads')
          .insert([testLead])
          .select()
          .single()

        addResult('Form Submission Test', !error, error ? error.message : 'Form submission successful', data)
      } catch (err: any) {
        addResult('Form Submission Test', false, err.message || 'Form submission failed')
      }

      // Test 5: Check RLS policies
      try {
        const { data, error } = await supabase.rpc('get_table_policies', { table_name: 'leads' })
        addResult('RLS Policies Check', !error, error ? error.message : 'RLS policies retrieved', data)
      } catch (err: any) {
        addResult('RLS Policies Check', false, 'Could not check RLS policies (this is expected)')
      }

    } catch (err: any) {
      addResult('General Error', false, err.message || 'Unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const testFormSubmission = async () => {
    setIsLoading(true)
    
    try {
      // Test the actual createLead function from the library
      const { createLead } = await import('@/lib/supabase')
      
      const testData = {
        business_name: 'Direct Test Company',
        full_name: 'Direct Test User',
        email: 'directtest+' + Date.now() + '@example.com',
        industry: 'technology',
        number_of_users: '1-10',
        source: 'direct_test'
      }

      const result = await createLead(testData)
      addResult('Direct createLead Test', true, 'createLead function works correctly', result)
    } catch (err: any) {
      addResult('Direct createLead Test', false, err.message || 'createLead function failed', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Request Access Form Diagnostics
          </h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
            </button>
            
            <button
              onClick={testFormSubmission}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 ml-4"
            >
              {isLoading ? 'Testing...' : 'Test Form Submission'}
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Test Results:</h2>
            
            {testResults.length === 0 && (
              <p className="text-gray-500">No tests run yet. Click "Run Full Diagnostics" to start.</p>
            )}
            
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{result.test}</h3>
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.data && (
                  <pre className="text-xs text-gray-500 mt-2 overflow-auto bg-gray-100 p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                )}
                <p className="text-xs text-gray-400 mt-2">{result.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 