import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Trophy, Settings, Gift, Target } from 'lucide-react';
import { useRewards } from '@/hooks/useRewards';
import { useGamificationRules } from '@/hooks/useGamificationRules';
import { useAchievements } from '@/hooks/useAchievements';
import { useProfile } from '@/hooks/useProfile';

const GamificationManagementPanel = () => {
  const { profile, canEditContent, canDeleteContent } = useProfile();
  const { rewards, createReward, updateReward, deleteReward } = useRewards();
  const { rules, createRule, updateRule, deleteRule } = useGamificationRules();
  const { achievements, createAchievement, updateAchievement, deleteAchievement } = useAchievements();

  const [activeTab, setActiveTab] = useState('rewards');
  const [rewardForm, setRewardForm] = useState({ name: '', description: '', xp_cost: 0, icon: '', is_active: true });
  const [ruleForm, setRuleForm] = useState({ rule_type: 'purchase', rule_name: '', description: '', xp_amount: 0, threshold_value: 0, is_active: true });
  const [achievementForm, setAchievementForm] = useState({ name: '', description: '', xp_reward: 0, condition_type: 'purchase_count', condition_value: 0, icon: '', is_active: true });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateReward(editingItem.id, rewardForm);
      } else {
        await createReward(rewardForm);
      }
      setRewardForm({ name: '', description: '', xp_cost: 0, icon: '', is_active: true });
      setEditingItem(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateRule(editingItem.id, ruleForm);
      } else {
        await createRule(ruleForm);
      }
      setRuleForm({ rule_type: 'purchase', rule_name: '', description: '', xp_amount: 0, threshold_value: 0, is_active: true });
      setEditingItem(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving rule:', error);
    }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateAchievement(editingItem.id, achievementForm);
      } else {
        await createAchievement(achievementForm);
      }
      setAchievementForm({ name: '', description: '', xp_reward: 0, condition_type: 'purchase_count', condition_value: 0, icon: '', is_active: true });
      setEditingItem(null);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const openEditDialog = (item: any, type: 'reward' | 'rule' | 'achievement') => {
    setEditingItem(item);
    if (type === 'reward') {
      setRewardForm(item);
    } else if (type === 'rule') {
      setRuleForm(item);
    } else {
      setAchievementForm(item);
    }
    setDialogOpen(true);
  };

  const iconOptions = ['Trophy', 'Gift', 'Star', 'Crown', 'Target', 'ShoppingCart', 'Share2', 'Award', 'Percent', 'Truck'];

  return (
    <Card className="card-gaming border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl text-neon flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Gestión de Recompensas y Reglas Gamificadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Reglas
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Logros
            </TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gestión de Recompensas</h3>
              {canEditContent() && (
                <Dialog open={dialogOpen && activeTab === 'rewards'} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingItem(null);
                        setRewardForm({ name: '', description: '', xp_cost: 0, icon: '', is_active: true });
                      }}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Recompensa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Editar Recompensa' : 'Nueva Recompensa'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRewardSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="reward-name">Nombre</Label>
                        <Input
                          id="reward-name"
                          value={rewardForm.name}
                          onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-description">Descripción</Label>
                        <Textarea
                          id="reward-description"
                          value={rewardForm.description}
                          onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-cost">Costo en XP Coins</Label>
                        <Input
                          id="reward-cost"
                          type="number"
                          value={rewardForm.xp_cost}
                          onChange={(e) => setRewardForm({ ...rewardForm, xp_cost: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reward-icon">Ícono</Label>
                        <Select value={rewardForm.icon} onValueChange={(value) => setRewardForm({ ...rewardForm, icon: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ícono" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map(icon => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="reward-active"
                          checked={rewardForm.is_active}
                          onCheckedChange={(checked) => setRewardForm({ ...rewardForm, is_active: checked })}
                        />
                        <Label htmlFor="reward-active">Activa</Label>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingItem ? 'Actualizar' : 'Crear'} Recompensa
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Costo XP</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEditContent() && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.name}</TableCell>
                    <TableCell>{reward.description}</TableCell>
                    <TableCell>{reward.xp_cost}</TableCell>
                    <TableCell>
                      <Badge variant={reward.is_active ? "default" : "secondary"}>
                        {reward.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    {canEditContent() && (
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(reward, 'reward')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {canDeleteContent() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteReward(reward.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gestión de Reglas</h3>
              {canEditContent() && (
                <Dialog open={dialogOpen && activeTab === 'rules'} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingItem(null);
                        setRuleForm({ rule_type: 'purchase', rule_name: '', description: '', xp_amount: 0, threshold_value: 0, is_active: true });
                      }}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Regla
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Editar Regla' : 'Nueva Regla'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRuleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="rule-type">Tipo de Regla</Label>
                        <Select value={ruleForm.rule_type} onValueChange={(value: any) => setRuleForm({ ...ruleForm, rule_type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purchase">Compras</SelectItem>
                            <SelectItem value="social_post">Publicaciones Sociales</SelectItem>
                            <SelectItem value="level_threshold">Umbral de Nivel</SelectItem>
                            <SelectItem value="special_event">Evento Especial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="rule-name">Nombre</Label>
                        <Input
                          id="rule-name"
                          value={ruleForm.rule_name}
                          onChange={(e) => setRuleForm({ ...ruleForm, rule_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-description">Descripción</Label>
                        <Textarea
                          id="rule-description"
                          value={ruleForm.description}
                          onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-xp">XP Coins</Label>
                        <Input
                          id="rule-xp"
                          type="number"
                          value={ruleForm.xp_amount}
                          onChange={(e) => setRuleForm({ ...ruleForm, xp_amount: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-threshold">Valor Umbral</Label>
                        <Input
                          id="rule-threshold"
                          type="number"
                          value={ruleForm.threshold_value}
                          onChange={(e) => setRuleForm({ ...ruleForm, threshold_value: parseFloat(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="rule-active"
                          checked={ruleForm.is_active}
                          onCheckedChange={(checked) => setRuleForm({ ...ruleForm, is_active: checked })}
                        />
                        <Label htmlFor="rule-active">Activa</Label>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingItem ? 'Actualizar' : 'Crear'} Regla
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>XP Coins</TableHead>
                  <TableHead>Umbral</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEditContent() && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {rule.rule_type === 'purchase' ? 'Compras' : 
                         rule.rule_type === 'social_post' ? 'Social' :
                         rule.rule_type === 'level_threshold' ? 'Nivel' : 'Evento'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{rule.rule_name}</TableCell>
                    <TableCell>{rule.xp_amount}</TableCell>
                    <TableCell>{rule.threshold_value}</TableCell>
                    <TableCell>
                      <Badge variant={rule.is_active ? "default" : "secondary"}>
                        {rule.is_active ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </TableCell>
                    {canEditContent() && (
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(rule, 'rule')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {canDeleteContent() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gestión de Logros</h3>
              {canEditContent() && (
                <Dialog open={dialogOpen && activeTab === 'achievements'} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setEditingItem(null);
                        setAchievementForm({ name: '', description: '', xp_reward: 0, condition_type: 'purchase_count', condition_value: 0, icon: '', is_active: true });
                      }}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Logro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Editar Logro' : 'Nuevo Logro'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAchievementSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="achievement-name">Nombre</Label>
                        <Input
                          id="achievement-name"
                          value={achievementForm.name}
                          onChange={(e) => setAchievementForm({ ...achievementForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="achievement-description">Descripción</Label>
                        <Textarea
                          id="achievement-description"
                          value={achievementForm.description}
                          onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="achievement-reward">XP Recompensa</Label>
                        <Input
                          id="achievement-reward"
                          type="number"
                          value={achievementForm.xp_reward}
                          onChange={(e) => setAchievementForm({ ...achievementForm, xp_reward: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="achievement-condition">Tipo de Condición</Label>
                        <Select value={achievementForm.condition_type} onValueChange={(value: any) => setAchievementForm({ ...achievementForm, condition_type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="purchase_count">Número de Compras</SelectItem>
                            <SelectItem value="social_posts">Publicaciones Sociales</SelectItem>
                            <SelectItem value="xp_threshold">Umbral de XP</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="achievement-value">Valor de Condición</Label>
                        <Input
                          id="achievement-value"
                          type="number"
                          value={achievementForm.condition_value}
                          onChange={(e) => setAchievementForm({ ...achievementForm, condition_value: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="achievement-icon">Ícono</Label>
                        <Select value={achievementForm.icon} onValueChange={(value) => setAchievementForm({ ...achievementForm, icon: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ícono" />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map(icon => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="achievement-active"
                          checked={achievementForm.is_active}
                          onCheckedChange={(checked) => setAchievementForm({ ...achievementForm, is_active: checked })}
                        />
                        <Label htmlFor="achievement-active">Activo</Label>
                      </div>
                      <Button type="submit" className="w-full">
                        {editingItem ? 'Actualizar' : 'Crear'} Logro
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>XP Recompensa</TableHead>
                  <TableHead>Condición</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEditContent() && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">{achievement.name}</TableCell>
                    <TableCell>{achievement.description}</TableCell>
                    <TableCell>{achievement.xp_reward}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {achievement.condition_type === 'purchase_count' ? 'Compras' :
                         achievement.condition_type === 'social_posts' ? 'Social' :
                         achievement.condition_type === 'xp_threshold' ? 'XP' : 'Custom'}: {achievement.condition_value}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={achievement.is_active ? "default" : "secondary"}>
                        {achievement.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    {canEditContent() && (
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(achievement, 'achievement')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {canDeleteContent() && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteAchievement(achievement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GamificationManagementPanel;