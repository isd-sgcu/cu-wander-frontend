# background-pedometer

Step track in the background

## Install

```bash
npm install background-pedometer
npx cap sync
```

## API

<docgen-index>

* [`requestPermission()`](#requestpermission)
* [`enable(...)`](#enable)
* [`disable()`](#disable)
* [`addListener('steps', ...)`](#addlistenersteps)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### requestPermission()

```typescript
requestPermission() => Promise<CallResponse<boolean>>
```

Asking for permission
return true only if user already have permission or user approve permission

**Returns:** <code>Promise&lt;<a href="#callresponse">CallResponse</a>&lt;boolean&gt;&gt;</code>

--------------------


### enable(...)

```typescript
enable(option: EnableOption) => Promise<CallResponse<void>>
```

Start pedometer background service
The service should be unable to start when permission is not granted
The service should be connected to the websocket server

| Param        | Type                                                  |
| ------------ | ----------------------------------------------------- |
| **`option`** | <code><a href="#enableoption">EnableOption</a></code> |

**Returns:** <code>Promise&lt;<a href="#callresponse">CallResponse</a>&lt;void&gt;&gt;</code>

--------------------


### disable()

```typescript
disable() => Promise<void>
```

Stop pedometer background service

--------------------


### addListener('steps', ...)

```typescript
addListener(eventName: 'steps', callback: (event: SensorEvent) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

add listener to change in step.

| Param           | Type                                                                    |
| --------------- | ----------------------------------------------------------------------- |
| **`eventName`** | <code>'steps'</code>                                                    |
| **`callback`**  | <code>(event: <a href="#sensorevent">SensorEvent</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### CallResponse

value indicated the response body
errMsg contain error message
error can be check by checking whether `errMsg` is empty

| Prop         | Type                |
| ------------ | ------------------- |
| **`value`**  | <code>T</code>      |
| **`errMsg`** | <code>string</code> |


#### EnableOption

| Prop            | Type                |
| --------------- | ------------------- |
| **`token`**     | <code>string</code> |
| **`wsAddress`** | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### SensorEvent

| Prop        | Type                |
| ----------- | ------------------- |
| **`steps`** | <code>number</code> |

</docgen-api>
