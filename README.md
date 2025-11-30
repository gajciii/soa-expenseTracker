### 📦 Mikroservisi – delo s submoduli

Ta repozitorij uporablja Git submodule, kjer je vsaka mikrostoritev ločen repo.
Spodaj so navodila za kloniranje, posodabljanje in dodajanje submodulov.
<br/>
<br/>

### ⚠️ Pomembno – submoduli morajo biti PUBLIC

Da kloniranje deluje brez težav, morajo biti vsi submoduli nastavljeni na public.
Private submoduli povzročijo napake pri kloniranju in inicializaciji.
<br/>
<br/>

### 🚀 Kloniranje repozitorija z vsemi mikrostoritvami

1. Kloniraš glavni repo:
   ```bash
   git clone https://github.com/gajciii/soa-expenseTracker.git
   cd soa-expenseTracker
   ```
2. Potegneš vse submodule:
   ```bash
   git submodule update --init --recursive
   ```
3. Če želiš posodobiti vse submodule na najnovejši commit:
   ```bash
   git submodule foreach git pull
   ```
   ali:
   ```bash
   git submodule foreach git pull origin main   # če vsi delajo na main
   ```

### ➕ Dodajanje nove mikrostoritve (submodula)

Vsaka mikrostoritev je ločen GitHub repozitorij, ki ga v ta projekt dodamo kot **submodule**.

1. Dodaj submodule v root projekta
   Submodule se doda v **koren projekta**, npr. kot map "soa-notification":

   Primer:

   ```bash
   git submodule add <URL_DO_REPOZITORIJA> soa-notification
   ```

2. Potrdiš spremembe:
   ```bash
   git commit -m "Dodana nova mikrostoritev: user-service"
   git push
   ```
