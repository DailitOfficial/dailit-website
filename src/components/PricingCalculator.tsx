'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface CalculatorInputs {
  employees: number
  features: string[]
  currentBill: number
  callVolume: number
  internationalCalls: boolean
}

interface PricingResult {
  monthlyDailit: number
  annualSavings: number
  savingsVsOpenPhone: number
  savingsVsRingCentral: number
  breakdownDailit: CalculatorBreakdown
}

interface CalculatorBreakdown {
  baseUsers: number
  baseCost: number
  featureCosts: number
  totalMonthly: number
}

const availableFeatures = [
  { id: 'recording', name: 'Call Recording', cost: 0, highlight: true, description: 'Included FREE' },
  { id: 'teams', name: 'Teams Integration', cost: 0, highlight: true, description: 'Native integration' },
  { id: 'callcenter', name: 'Call Center Features', cost: 0, highlight: true, description: 'Basic features FREE' },
  { id: 'api', name: 'API Access', cost: 0, highlight: true, description: 'Unlimited FREE' },
  { id: 'advanced-routing', name: 'Advanced Call Routing', cost: 5, highlight: false, description: '$5/user/month' },
  { id: 'analytics', name: 'Advanced Analytics', cost: 3, highlight: false, description: '$3/user/month' }
]

export function PricingCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    employees: 10,
    features: ['recording', 'teams', 'api'],
    currentBill: 500,
    callVolume: 100,
    internationalCalls: false
  })

  const [result, setResult] = useState<PricingResult | null>(null)
  const [step, setStep] = useState(1)

  const calculatePricing = (calculatorInputs: CalculatorInputs): PricingResult => {
    const baseUserCost = 10 // $10 per user base cost
    
    // Calculate feature costs
    const selectedFeaturesCost = availableFeatures
      .filter(feature => calculatorInputs.features.includes(feature.id))
      .reduce((total, feature) => total + feature.cost, 0)

    // Dail it calculation
    const baseCost = calculatorInputs.employees * baseUserCost
    const featureCosts = calculatorInputs.employees * selectedFeaturesCost
    const internationalCost = calculatorInputs.internationalCalls ? 20 : 0
    const monthlyDailit = baseCost + featureCosts + internationalCost

    // Competitor calculations (estimated)
    const openPhoneCost = calculatorInputs.employees * 15 + (calculatorInputs.employees * 5) // API costs extra
    const ringCentralCost = calculatorInputs.employees * 25 + featureCosts

    // Annual savings calculations
    const annualSavings = (calculatorInputs.currentBill - monthlyDailit) * 12
    const savingsVsOpenPhone = (openPhoneCost - monthlyDailit) * 12
    const savingsVsRingCentral = (ringCentralCost - monthlyDailit) * 12

    return {
      monthlyDailit,
      annualSavings,
      savingsVsOpenPhone,
      savingsVsRingCentral,
      breakdownDailit: {
        baseUsers: calculatorInputs.employees,
        baseCost,
        featureCosts: featureCosts + internationalCost,
        totalMonthly: monthlyDailit
      }
    }
  }

  useEffect(() => {
    const newResult = calculatePricing(inputs)
    setResult(newResult)
  }, [inputs])

  const updateEmployees = (value: number) => {
    setInputs(prev => ({ ...prev, employees: value }))
  }

  const toggleFeature = (featureId: string) => {
    setInputs(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }))
  }

  const updateCurrentBill = (value: number) => {
    setInputs(prev => ({ ...prev, currentBill: value }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPercentageSavings = (savings: number, original: number) => {
    return Math.round((savings / original) * 100)
  }

  return (
    <section id="calculator" className="py-20 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4">
            Calculate Your Savings
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See exactly how much you can save by switching to Dail it. 
            Get instant pricing tailored to your business needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="bordered" className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Your Business Details</CardTitle>
                <p className="text-gray-600">
                  Tell us about your current setup to get accurate pricing
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Number of Employees */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-semibold text-gray-900">
                      Number of Employees
                    </label>
                    <span className="text-2xl font-bold text-primary">
                      {inputs.employees}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="500"
                      value={inputs.employees}
                      onChange={(e) => updateEmployees(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(inputs.employees / 500) * 100}%, #e5e7eb ${(inputs.employees / 500) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>1</span>
                      <span>500+</span>
                    </div>
                  </div>
                </div>

                {/* Current Monthly Bill */}
                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Current Monthly Phone Bill
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={inputs.currentBill}
                      onChange={(e) => updateCurrentBill(parseInt(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Include your total monthly communication costs
                  </p>
                </div>

                {/* Features Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Features You Need
                  </h3>
                  <div className="space-y-3">
                    {availableFeatures.map((feature) => (
                      <label
                        key={feature.id}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                          inputs.features.includes(feature.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={inputs.features.includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {feature.name}
                              {feature.highlight && (
                                <span className="ml-2 bg-secondary text-white px-2 py-1 rounded text-xs font-bold">
                                  FREE
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{feature.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {feature.cost === 0 ? 'FREE' : `$${feature.cost}/user`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* International Calls */}
                <div>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                    <input
                      type="checkbox"
                      checked={inputs.internationalCalls}
                      onChange={(e) => setInputs(prev => ({ ...prev, internationalCalls: e.target.checked }))}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium text-gray-900">International Calling</div>
                      <div className="text-sm text-gray-600">$20/month unlimited international</div>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Monthly Cost */}
            <Card variant="elevated" className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4">Your Dail it Cost</h3>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">
                    {result ? formatCurrency(result.monthlyDailit) : '$0'}
                  </div>
                  <div className="text-lg opacity-90">per month</div>
                  <div className="text-sm opacity-75 mt-2">
                    That's {result ? formatCurrency(result.monthlyDailit / inputs.employees) : '$0'} per employee
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Savings Comparison */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Your Potential Savings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">vs Current System</div>
                    <div className="text-sm text-gray-600">Annual savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {result && result.annualSavings > 0 ? formatCurrency(result.annualSavings) : '$0'}
                    </div>
                    <div className="text-sm text-green-600">
                      {result && inputs.currentBill > 0 ? `${getPercentageSavings(result.annualSavings, inputs.currentBill * 12)}% savings` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">vs OpenPhone</div>
                    <div className="text-sm text-gray-600">Annual savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">
                      {result ? formatCurrency(result.savingsVsOpenPhone) : '$0'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">vs RingCentral</div>
                    <div className="text-sm text-gray-600">Annual savings</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {result ? formatCurrency(result.savingsVsRingCentral) : '$0'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base cost ({inputs.employees} users × $10)</span>
                  <span className="font-semibold">{result ? formatCurrency(result.breakdownDailit.baseCost) : '$0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Additional features</span>
                  <span className="font-semibold">{result ? formatCurrency(result.breakdownDailit.featureCosts) : '$0'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total Monthly</span>
                  <span className="text-primary">{result ? formatCurrency(result.breakdownDailit.totalMonthly) : '$0'}</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card variant="elevated" className="bg-gradient-to-r from-secondary to-primary text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Start Saving?</h3>
                <p className="mb-4 opacity-90">
                  Get started with your customized plan today
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" href="#contact">
                    Get Started - {result ? formatCurrency(result.monthlyDailit) : '$0'}/month
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-center">Why Choose Dail it?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl mb-3">💰</div>
                  <h4 className="font-bold text-gray-900 mb-2">Transparent Pricing</h4>
                  <p className="text-gray-600 text-sm">No hidden fees or surprise charges. What you see is what you pay.</p>
                </div>
                <div>
                  <div className="text-3xl mb-3">🔓</div>
                  <h4 className="font-bold text-gray-900 mb-2">Unlimited API Access</h4>
                  <p className="text-gray-600 text-sm">Build unlimited integrations. Competitors charge $500+/month for this.</p>
                </div>
                <div>
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-bold text-gray-900 mb-2">15-Minute Setup</h4>
                  <p className="text-gray-600 text-sm">Get up and running in minutes, not hours or days.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </section>
  )
} 